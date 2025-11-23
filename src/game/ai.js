import SimulationGame from './SimulationGame';

const createAI = (aiTurn) => {
  const ranks = { pawn: 1, king: 2, bishop: 3, knight: 3, rook: 5, queen: 9 };

  const simulationGame = new SimulationGame([], 'white');

  const deepest = 2; // Reduced from 3 to prevent browser freeze

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

    return total;
  };

  const isBetterScore = (score1, score2, turn) => (turn === aiTurn ? score1 >= score2 : score1 <= score2);

  const isScoreGoodEnough = (score, turn) => (turn === aiTurn ? score > 50 : score < -50);

  const minimax = (pieces, turn, depth = 0) => {
    simulationGame.startNewGame(pieces, turn);

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

      for (const move of allowedMoves) {
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

        // FIXED: Only use depth check and good-enough check for early cutoff
        if (depth >= deepest || isScoreGoodEnough(curScore, turn)) {
          currentTestPlayInfo.score = curScore;
        } else {
          // Recurse to next depth with opposite turn
          const nextTurn = turn === aiTurn ? humanTurn : aiTurn;
          const result = minimax(simulationGame.pieces, nextTurn, depth + 1);
          currentTestPlayInfo.score = result.score;
        }

        if (isBetterScore(currentTestPlayInfo.score, bestPlay.score, turn)) {
          bestPlay.move = currentTestPlayInfo.move;
          bestPlay.score = currentTestPlayInfo.score;
        }

        simulationGame.startNewGame(pieces, turn);
      }
    }

    return bestPlay;
  };

  const play = (pieces, callback) => {
    const opponentPieceCount = countOpponentPieces(pieces);
    const mode = shouldPrioritizeCheckmate(pieces) ? 'CHECKMATE' : 'STANDARD';
    console.log(`AI play called - Opponent pieces: ${opponentPieceCount}, Mode: ${mode}`);
    console.log(`Total pieces on board: ${pieces.length}`);
    
    // Use setTimeout to prevent UI freeze
    setTimeout(() => {
      const startTime = Date.now();
      try {
        const aiPlay = minimax(pieces, aiTurn);
        const endTime = Date.now();
        console.log(`AI minimax completed in ${endTime - startTime}ms`);
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
