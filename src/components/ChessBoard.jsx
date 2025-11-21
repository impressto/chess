import React, { useState, useEffect } from 'react';
import './ChessBoard.css';
import boardImage from '../assets/images/board.jpeg';

// Import all piece images
import blackBishop from '../assets/images/peices/black-bishop.png';
import blackCastle from '../assets/images/peices/black-castle.png';
import blackKing from '../assets/images/peices/black-king.png';
import blackKnight from '../assets/images/peices/black-knight.png';
import blackPawn from '../assets/images/peices/black-pawn.png';
import blackQueen from '../assets/images/peices/black-queen.png';
import whiteBishop from '../assets/images/peices/white-bishop.png';
import whiteCastle from '../assets/images/peices/white-castle.png';
import whiteKing from '../assets/images/peices/white-king.png';
import whiteKnight from '../assets/images/peices/white-knight.png';
import whitePawn from '../assets/images/peices/white-pawn.png';
import whiteQueen from '../assets/images/peices/white-queen.png';

const ChessBoard = ({ pieces, onSquareClick, allowedMoves, clickedSquare, lastMove, capturedPieces, turn }) => {
  console.log('ChessBoard rendering with', pieces.length, 'pieces');
  
  const [showTurnIndicator, setShowTurnIndicator] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(turn);

  // Show turn indicator when turn changes
  useEffect(() => {
    if (turn !== currentTurn) {
      setCurrentTurn(turn);
      setShowTurnIndicator(true);
      
      const timer = setTimeout(() => {
        setShowTurnIndicator(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [turn, currentTurn]);
  
  const getTurnText = () => {
    return turn === 'white' ? 'Le toca a las blancas' : 'Le toca a las negras';
  };
  
  // Map piece types to their images
  const pieceImages = {
    black: {
      bishop: blackBishop,
      rook: blackCastle,
      king: blackKing,
      knight: blackKnight,
      pawn: blackPawn,
      queen: blackQueen
    },
    white: {
      bishop: whiteBishop,
      rook: whiteCastle,
      king: whiteKing,
      knight: whiteKnight,
      pawn: whitePawn,
      queen: whiteQueen
    }
  };

  const getPieceImage = (color, rank) => {
    return pieceImages[color][rank];
  };

  // Generate board squares (rows 8 to 1, columns a-h represented as 1-8)
  const renderBoard = () => {
    const rows = [];
    
    for (let row = 8; row >= 1; row--) {
      const squares = [];
      const isEvenRow = row % 2 === 0;
      
      for (let col = 1; col <= 8; col++) {
        const position = row * 10 + col;
        const piece = pieces.find(p => p.position === position);
        const isAllowed = allowedMoves.includes(position);
        const isClicked = clickedSquare === position;
        const isLastMove = lastMove.includes(position);
        
        // Determine square color
        const isLightSquare = isEvenRow ? col % 2 === 0 : col % 2 !== 0;
        
        let squareClass = 'square';
        if (isLightSquare) squareClass += ' light';
        else squareClass += ' dark';
        if (isAllowed) squareClass += ' allowed';
        if (isClicked) squareClass += ' clicked-square';
        if (isLastMove) squareClass += ' last-move';
        
        squares.push(
          <div
            key={position}
            className={squareClass}
            data-position={position}
            onClick={() => onSquareClick(position)}
          >
            {piece && (
              <img
                src={getPieceImage(piece.color, piece.rank)}
                alt={`${piece.color} ${piece.rank}`}
                className={`piece ${piece.rank}`}
                draggable="false"
              />
            )}
          </div>
        );
      }
      
      rows.push(
        <div key={row} className={isEvenRow ? 'even' : 'odd'}>
          {squares}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="board-wrapper">
      {/* Captured pieces by black (white pieces taken) - top left */}
      <div className="captured-pieces captured-top-left">
        {capturedPieces.black.map((piece, index) => (
          <img
            key={`${piece.name}-${index}`}
            src={getPieceImage(piece.color, piece.rank)}
            alt={`captured ${piece.color} ${piece.rank}`}
            className="captured-piece"
          />
        ))}
      </div>

      <div className="board-container">
        {/* Background image layer */}
        <div className="board-background" style={{ backgroundImage: `url(${boardImage})` }}></div>
        
        {/* Turn indicator overlay */}
        {showTurnIndicator && (
          <div className="turn-indicator-overlay">
            <div className="turn-indicator-text">{getTurnText()}</div>
          </div>
        )}
        
        {/* Actual board with squares */}
        <div id="board">
          {renderBoard()}
        </div>
      </div>

      {/* Captured pieces by white (black pieces taken) - bottom right */}
      <div className="captured-pieces captured-bottom-right">
        {capturedPieces.white.map((piece, index) => (
          <img
            key={`${piece.name}-${index}`}
            src={getPieceImage(piece.color, piece.rank)}
            alt={`captured ${piece.color} ${piece.rank}`}
            className="captured-piece"
          />
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;
