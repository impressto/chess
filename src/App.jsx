import React, { useState, useEffect, useRef } from 'react';
import Game from './game/Game';
import createAI from './game/ai';
import { initialPieces } from './game/initialPieces';
import ChessBoard from './components/ChessBoard';
import StartMenu from './components/StartMenu';
import EndGameModal from './components/EndGameModal';
import GameInfo from './components/GameInfo';
import './App.css';

function App() {
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [showEndGame, setShowEndGame] = useState(false);
  const [winner, setWinner] = useState('');
  const [turn, setTurn] = useState('white');
  const [pieces, setPieces] = useState([]);
  const [allowedMoves, setAllowedMoves] = useState([]);
  const [clickedSquare, setClickedSquare] = useState(null);
  const [clickedPieceName, setClickedPieceName] = useState(null);
  const [lastMove, setLastMove] = useState([]);
  const [gameState, setGameState] = useState('idle');
  const [gameOptions, setGameOptions] = useState({ opponent: 'human', playerColor: 'white' });
  
  const gameRef = useRef(null);
  const aiPlayerRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Game(initialPieces, 'white');
      setupGameEvents();
    }
  }, []);

  const setupGameEvents = () => {
    const game = gameRef.current;

    game.on('pieceMove', (move) => {
      setPieces([...game.pieces]);
      setLastMove([move.from, move.piece.position]);
      setAllowedMoves([]);
      setClickedSquare(null);
      setClickedPieceName(null);
    });

    game.on('turnChange', (newTurn) => {
      setTurn(newTurn);
      setGameState(newTurn + '_turn');
      
      // Check if it's AI's turn
      if (gameOptions.opponent === 'ai' && newTurn !== gameOptions.playerColor) {
        setGameState('ai_thinking');
        
        // AI makes a move
        if (aiPlayerRef.current) {
          aiPlayerRef.current.play(game.pieces, (aiPlay) => {
            if (aiPlay.move) {
              game.movePiece(aiPlay.move.pieceName, aiPlay.move.position);
            }
            setGameState(game.turn + '_turn');
          });
        }
      }
    });

    game.on('promotion', () => {
      setPieces([...game.pieces]);
    });

    game.on('kill', () => {
      setPieces([...game.pieces]);
    });

    game.on('checkMate', (winningColor) => {
      setWinner(winningColor);
      setShowEndGame(true);
      setGameState('checkmate');
    });
  };

  const handleStartGame = (options) => {
    setGameOptions(options);
    setShowStartMenu(false);
    
    // Create AI if playing against AI
    if (options.opponent === 'ai') {
      const aiColor = options.playerColor === 'white' ? 'black' : 'white';
      aiPlayerRef.current = createAI(aiColor);
    } else {
      aiPlayerRef.current = null;
    }
    
    const game = gameRef.current;
    game.startNewGame(initialPieces, 'white');
    setupGameEvents();
    
    setPieces([...game.pieces]);
    setTurn('white');
    setAllowedMoves([]);
    setClickedSquare(null);
    setClickedPieceName(null);
    setLastMove([]);
    setShowEndGame(false);
    setWinner('');
    setGameState('white_turn');
    
    // If player chose black and AI is white, AI makes first move
    if (options.opponent === 'ai' && options.playerColor === 'black') {
      setGameState('ai_thinking');
      setTimeout(() => {
        if (aiPlayerRef.current) {
          aiPlayerRef.current.play(game.pieces, (aiPlay) => {
            if (aiPlay.move) {
              game.movePiece(aiPlay.move.pieceName, aiPlay.move.position);
            }
            setGameState(game.turn + '_turn');
          });
        }
      }, 500);
    }
  };

  const handleSquareClick = (position) => {
    const game = gameRef.current;
    
    if (gameState === 'checkmate' || gameState === 'ai_thinking') return;
    
    const existingPiece = game.getPieceByPos(position);

    // If clicking on own piece, show allowed moves
    if (existingPiece && existingPiece.color === game.turn) {
      const moves = game.getPieceAllowedMoves(existingPiece.name);
      setAllowedMoves(moves);
      setClickedSquare(position);
      setClickedPieceName(existingPiece.name);
      return;
    }

    // If a piece is selected and clicking on an allowed square, move the piece
    if (clickedPieceName && allowedMoves.includes(position)) {
      const success = game.movePiece(clickedPieceName, position);
      if (success) {
        // The game events will handle state updates
      }
    } else {
      // Clear selection if clicking elsewhere
      setAllowedMoves([]);
      setClickedSquare(null);
      setClickedPieceName(null);
    }
  };

  const handleUndo = () => {
    const game = gameRef.current;
    game.undo();
    setPieces([...game.pieces]);
    setTurn(game.turn);
    setAllowedMoves([]);
    setClickedSquare(null);
    setClickedPieceName(null);
    setLastMove([]);
  };

  const handleNewGame = () => {
    setShowStartMenu(true);
    setShowEndGame(false);
    setWinner('');
  };

  return (
    <div className="App">
      <h1 className="title">Chess Game</h1>
      
      <StartMenu show={showStartMenu} onStartGame={handleStartGame} />
      <EndGameModal show={showEndGame} winner={winner} onNewGame={handleNewGame} />
      
      {!showStartMenu && (
        <>
          <GameInfo 
            turn={turn} 
            gameState={gameState}
            onUndo={handleUndo}
            onNewGame={handleNewGame}
          />
          
          <div className="board-container">
            <ChessBoard
              pieces={pieces}
              onSquareClick={handleSquareClick}
              allowedMoves={allowedMoves}
              clickedSquare={clickedSquare}
              lastMove={lastMove}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
