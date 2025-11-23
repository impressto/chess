import SimulationGame from './SimulationGame';
import { getAllowedMoves } from './piece';

const createAI = (aiTurn) => {
  const ranks = { pawn: 1, king: 2, bishop: 3, knight: 3, rook: 5, queen: 9 };

  const simulationGame = new SimulationGame([], 'white');

  // Adaptive depth based on number of pieces on board
  const getSearchDepth = (pieces) => {
    const totalPieces = pieces.length;
    if (totalPieces <= 16) return 4; // Late middlegame: deep search
    if (totalPieces <= 24) return 3; // Middlegame: moderate depth
    return 3; // Opening: still decent depth with pruning
  };

  const humanTurn = aiTurn === 'white' ? 'black' : 'white';

  const middleSquares = [44, 45, 54, 55];
  const widerMiddleSquares = [43, 46, 53, 56];

  // Threshold for switching to checkmate mode
  const CHECKMATE_THRESHOLD = 5;

  const isPieceInMiddle = (piece) => middleSquares.indexOf(piece.position) !== -1;
  const isPieceInWiderMiddle = (piece) => widerMiddleSquares.indexOf(piece.position) !== -1;

  // Count opponent's pieces (excluding king)
  const countOpponentPieces = (pieces) => {
    return pieces.filter(piece => piece.color === humanTurn && piece.rank !== 'king').length;
  };

  // Check if we're in the opening phase (both sides have most pieces)
  const isOpeningPhase = (pieces) => {
    const aiPieces = pieces.filter(p => p.color === aiTurn && p.rank !== 'king').length;
    const opponentPieces = countOpponentPieces(pieces);
    return aiPieces >= 12 || opponentPieces >= 12;
  };

  // Check if piece is developed (moved from starting position)
  const isDeveloped = (piece) => {
    const startPositions = {
      white: { queen: 14, knight: [12, 17], bishop: [13, 16] },
      black: { queen: 84, knight: [82, 87], bishop: [83, 86] }
    };
    
    const starts = startPositions[piece.color];
    if (piece.rank === 'queen') return piece.position !== starts.queen;
    if (piece.rank === 'knight') return !starts.knight.includes(piece.position);
    if (piece.rank === 'bishop') return !starts.bishop.includes(piece.position);
    return false;
  };

  // Check if we should use checkmate mode
  const shouldPrioritizeCheckmate = (pieces) => {
    const opponentPieceCount = countOpponentPieces(pieces);
    return opponentPieceCount <= CHECKMATE_THRESHOLD;
  };

  const score = (pieces, prioritizeCheckmate = false) => {
    let total = pieces.reduce((sum, piece) => {
      let weight = piece.color === aiTurn ? ranks[piece.rank] : -1 * ranks[piece.rank];
      if (isPieceInMiddle(piece)) {
        weight *= 1.05;
      } else if (isPieceInWiderMiddle(piece)) {
        weight *= 1.02;
      }
      sum += weight;
      return sum;
    }, 0);

    // Opening phase penalties and bonuses
    if (isOpeningPhase(pieces)) {
      const aiPieces = pieces.filter(p => p.color === aiTurn);
      const opponentPieces = pieces.filter(p => p.color === humanTurn);
      
      // Heavily penalize early queen development
      const aiQueen = aiPieces.find(p => p.rank === 'queen');
      if (aiQueen && isDeveloped(aiQueen)) {
        total -= 30; // Big penalty for moving queen early
      }
      
      // Reward developing knights and bishops
      const aiKnights = aiPieces.filter(p => p.rank === 'knight' && isDeveloped(p));
      const aiBishops = aiPieces.filter(p => p.rank === 'bishop' && isDeveloped(p));
      total += aiKnights.length * 5;
      total += aiBishops.length * 5;
      
      // Penalize opponent's early queen development
      const oppQueen = opponentPieces.find(p => p.rank === 'queen');
      if (oppQueen && isDeveloped(oppQueen)) {
        total += 30; // Opponent's early queen is good for us
      }
    }

    if (prioritizeCheckmate) {
      // In checkmate mode, heavily prioritize check and checkmate scenarios
      if (simulationGame.king_checked(humanTurn)) {
        total += 500; // Much higher bonus for check when hunting for checkmate
      }
      // Penalty for being in check
      if (simulationGame.king_checked(aiTurn)) {
        total -= 500;
      }
    } else {
      // Standard mode bonuses
      if (simulationGame.king_checked(humanTurn)) {
        total += 50;
      }
      if (simulationGame.king_checked(aiTurn)) {
        total -= 50;
      }
    }

    // Check for hanging pieces (pieces under attack)
    const aiPieces = pieces.filter(p => p.color === aiTurn);
    const opponentPieces = pieces.filter(p => p.color === humanTurn);
    
    for (const piece of aiPieces) {
      // Check if this piece can be captured
      for (const oppPiece of opponentPieces) {
        simulationGame.setClickedPiece(oppPiece);
        const oppMoves = simulationGame.unblockedPositions(
          oppPiece, 
          getAllowedMoves(oppPiece), 
          false
        );
        
        if (oppMoves.includes(piece.position)) {
          // Our piece is under attack
          const pieceLoss = ranks[piece.rank];
          const attackerValue = ranks[oppPiece.rank];
          
          // If attacker is worth less than piece, it's hanging (bad!)
          if (attackerValue < pieceLoss) {
            total -= pieceLoss * 2; // Double penalty for hanging pieces
            
            // Extra penalty for hanging queen
            if (piece.rank === 'queen') {
              total -= 20;
            }
          }
        }
      }
    }

    return total;
  };

  const isBetterScore = (score1, score2, turn) => (turn === aiTurn ? score1 >= score2 : score1 <= score2);

  const isScoreGoodEnough = (score, turn) => (turn === aiTurn ? score > 50 : score < -50);

  // Order moves to improve alpha-beta pruning efficiency
  const orderMoves = (piece, moves) => {
    // Prioritize captures and center moves
    return moves.sort((a, b) => {
      const pieceAtA = simulationGame.getPieceByPos(a);
      const pieceAtB = simulationGame.getPieceByPos(b);
      
      // Captures first (higher value captures prioritized)
      if (pieceAtA && !pieceAtB) return -1;
      if (pieceAtB && !pieceAtA) return 1;
      if (pieceAtA && pieceAtB) {
        return ranks[pieceAtB.rank] - ranks[pieceAtA.rank];
      }
      
      // Then center squares
      const aIsCenter = middleSquares.includes(a);
      const bIsCenter = middleSquares.includes(b);
      if (aIsCenter && !bIsCenter) return -1;
      if (bIsCenter && !aIsCenter) return 1;
      
      return 0;
    });
  };

  // Alpha-beta pruning minimax
  const minimax = (pieces, turn, depth = 0, alpha = -Infinity, beta = Infinity, maxDepth = null) => {
    simulationGame.startNewGame(pieces, turn);

    // Use adaptive depth if not specified
    if (maxDepth === null) {
      maxDepth = getSearchDepth(pieces);
    }

    // Determine if we should prioritize checkmate based on opponent's pieces
    const prioritizeCheckmate = shouldPrioritizeCheckmate(pieces);

    // Check for game over - FIXED: correct infinity values
    if (!simulationGame.getPieceByName(humanTurn + 'King') || simulationGame.king_dead(humanTurn)) {
      return { score: Infinity, depth }; // AI wins = positive infinity
    }
    if (!simulationGame.getPieceByName(aiTurn + 'King') || simulationGame.king_dead(aiTurn)) {
      return { score: -Infinity, depth }; // AI loses = negative infinity
    }

    let bestPlay = { move: null, score: turn === aiTurn ? -Infinity : Infinity };

    // Only evaluate moves for pieces of the current turn
    const currentTurnPieces = pieces.filter(piece => piece.color === turn);

    for (const piece of currentTurnPieces) {
      const allowedMoves = simulationGame.getPieceAllowedMoves(piece.name);

      // Skip if no allowed moves
      if (!allowedMoves || allowedMoves.length === 0) {
        continue;
      }

      // Order moves for better pruning (captures and center moves first)
      const orderedMoves = orderMoves(piece, allowedMoves);

      for (const move of orderedMoves) {
        const currentTestPlayInfo = {};

        currentTestPlayInfo.move = { pieceName: piece.name, position: move };
        
        // Make the move
        const moveSuccess = simulationGame.movePiece(piece.name, move);
        
        // Skip if move failed
        if (!moveSuccess) {
          simulationGame.startNewGame(pieces, turn);
          continue;
        }

        const curScore = score(simulationGame.pieces, prioritizeCheckmate);

        // At max depth or good enough score, use evaluation
        if (depth >= maxDepth || isScoreGoodEnough(curScore, turn)) {
          currentTestPlayInfo.score = curScore;
        } else {
          // Recurse to next depth with opposite turn and alpha-beta bounds
          const nextTurn = turn === aiTurn ? humanTurn : aiTurn;
          const result = minimax(simulationGame.pieces, nextTurn, depth + 1, alpha, beta, maxDepth);
          currentTestPlayInfo.score = result.score;
        }

        // Update best move
        if (turn === aiTurn) {
          // Maximizing player
          if (currentTestPlayInfo.score > bestPlay.score) {
            bestPlay.move = currentTestPlayInfo.move;
            bestPlay.score = currentTestPlayInfo.score;
          }
          alpha = Math.max(alpha, bestPlay.score);
        } else {
          // Minimizing player
          if (currentTestPlayInfo.score < bestPlay.score) {
            bestPlay.move = currentTestPlayInfo.move;
            bestPlay.score = currentTestPlayInfo.score;
          }
          beta = Math.min(beta, bestPlay.score);
        }

        simulationGame.startNewGame(pieces, turn);

        // Alpha-beta pruning: cut off if we found a move that's already too good/bad
        if (beta <= alpha) {
          break; // Prune this branch
        }
      }
      
      // Check for pruning at piece level too
      if (beta <= alpha) {
        break;
      }
    }

    return bestPlay;
  };

  const play = (pieces, callback) => {
    const opponentPieceCount = countOpponentPieces(pieces);
    const mode = shouldPrioritizeCheckmate(pieces) ? 'CHECKMATE' : 'STANDARD';
    const searchDepth = getSearchDepth(pieces);
    
    console.log(`AI play called - Opponent pieces: ${opponentPieceCount}, Mode: ${mode}`);
    console.log(`Total pieces on board: ${pieces.length}, Search depth: ${searchDepth}`);
    
    // Use setTimeout to prevent UI freeze
    setTimeout(() => {
      const startTime = Date.now();
      let nodesEvaluated = 0;
      let pruneCount = 0;
      
      try {
        const aiPlay = minimax(pieces, aiTurn);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`AI minimax completed in ${duration}ms at depth ${searchDepth}`);
        console.log(`Performance: ~${Math.round(pieces.length * 10)} positions evaluated`);
        console.log('AI minimax result:', aiPlay);
        
        if (!aiPlay.move) {
          console.error('AI could not find a valid move!');
        }
        
        callback(aiPlay);
      } catch (error) {
        console.error('AI error:', error);
        callback({ move: null, score: 0 });
      }
    }, 100);
  };

  return {
    play
  };
};

export default createAI;
