import React, { useState, useEffect, useRef } from 'react';
import Game from './game/Game';
import createAI from './game/ai';
import { initialPieces } from './game/initialPieces';
import ChessBoard from './components/ChessBoard';
import StartMenu from './components/StartMenu';
import EndGameModal from './components/EndGameModal';
import GameInfo from './components/GameInfo';
import logo from './assets/images/logo.png';
import splashImage from './assets/images/splash-image.png';
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
  const [updateCounter, setUpdateCounter] = useState(0);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  
  const gameRef = useRef(null);
  const aiPlayerRef = useRef(null);
  const gameOptionsRef = useRef({ opponent: 'human', playerColor: 'white' });

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Game(initialPieces, 'white');
      setupGameEvents();
    }
  }, []);

  const setupGameEvents = () => {
    const game = gameRef.current;

    game.on('pieceMove', (move) => {
      console.log('pieceMove event fired:', move);
      // Deep clone the pieces to ensure React detects the change
      const clonedPieces = game.pieces.map(p => ({...p}));
      console.log('Cloned pieces:', clonedPieces.length);
      setPieces(clonedPieces);
      setLastMove([move.from, move.piece.position]);
      setAllowedMoves([]);
      setClickedSquare(null);
      setClickedPieceName(null);
      setUpdateCounter(c => c + 1);
    });

    game.on('turnChange', (newTurn) => {
      console.log('Turn changed to:', newTurn);
      setTurn(newTurn);
      setGameState(newTurn + '_turn');
      
      // Check if it's AI's turn
      const currentOptions = gameOptionsRef.current;
      console.log('Current options:', currentOptions);
      console.log('Is AI turn?', currentOptions.opponent === 'ai' && newTurn !== currentOptions.playerColor);
      
      if (currentOptions.opponent === 'ai' && newTurn !== currentOptions.playerColor) {
        console.log('AI is thinking...');
        setGameState('ai_thinking');
        
        // AI makes a move
        if (aiPlayerRef.current) {
          console.log('Calling AI play...');
          aiPlayerRef.current.play(game.pieces, (aiPlay) => {
            console.log('AI play result:', aiPlay);
            if (aiPlay.move) {
              game.movePiece(aiPlay.move.pieceName, aiPlay.move.position);
            }
            setGameState(game.turn + '_turn');
          });
        } else {
          console.log('No AI player found!');
        }
      }
    });

    game.on('promotion', () => {
      setPieces(game.pieces.map(p => ({...p})));
    });

    game.on('kill', (piece) => {
      console.log('Piece killed:', piece);
      setPieces(game.pieces.map(p => ({...p})));
      // Add to captured pieces - the piece that was killed is captured by the opposite color
      const capturer = piece.color === 'white' ? 'black' : 'white';
      setCapturedPieces(prev => ({
        ...prev,
        [capturer]: [...prev[capturer], piece]
      }));
    });

    game.on('checkMate', (winningColor) => {
      setWinner(winningColor);
      setShowEndGame(true);
      setGameState('checkmate');
    });
  };

  const handleStartGame = (options) => {
    console.log('Starting game with options:', options);
    setGameOptions(options);
    gameOptionsRef.current = options;
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
    // Don't call setupGameEvents again - events are already set up
    
    const clonedPieces = game.pieces.map(p => ({...p}));
    console.log('Setting pieces:', clonedPieces.length, 'pieces');
    setPieces(clonedPieces);
    setTurn('white');
    setAllowedMoves([]);
    setClickedSquare(null);
    setClickedPieceName(null);
    setLastMove([]);
    setShowEndGame(false);
    setWinner('');
    setGameState('white_turn');
    setCapturedPieces({ white: [], black: [] });
    
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
    console.log('Square clicked:', position);
    const game = gameRef.current;
    
    if (gameState === 'checkmate' || gameState === 'ai_thinking') return;
    
    const existingPiece = game.getPieceByPos(position);
    console.log('Existing piece at position:', existingPiece);

    // If clicking on own piece, show allowed moves
    if (existingPiece && existingPiece.color === game.turn) {
      const moves = game.getPieceAllowedMoves(existingPiece.name);
      console.log('Allowed moves for', existingPiece.name, ':', moves);
      setAllowedMoves(moves);
      setClickedSquare(position);
      setClickedPieceName(existingPiece.name);
      return;
    }

    // If a piece is selected and clicking on an allowed square, move the piece
    console.log('Clicked piece name:', clickedPieceName, 'Allowed moves:', allowedMoves);
    if (clickedPieceName && allowedMoves.includes(position)) {
      console.log('Attempting to move', clickedPieceName, 'to', position);
      const success = game.movePiece(clickedPieceName, position);
      console.log('Move success:', success);
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
    setPieces(game.pieces.map(p => ({...p})));
    setTurn(game.turn);
    setAllowedMoves([]);
    setClickedSquare(null);
    setClickedPieceName(null);
    setLastMove([]);
    setCapturedPieces({ white: [], black: [] });
  };

  const handleNewGame = () => {
    setShowStartMenu(true);
    setShowEndGame(false);
    setWinner('');
  };

  return (
    <div 
      className="App" 
      style={showStartMenu ? { '--splash-image': `url(${splashImage})` } : {}}
    >
      {!showStartMenu && <img src={logo} alt="Chess Game" className="title-logo" />}
      
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
              capturedPieces={capturedPieces}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
