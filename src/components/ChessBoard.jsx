import React, { useState, useEffect, useRef } from 'react';
import './ChessBoard.css';
import boardImage from '../assets/images/board.jpg';

// Import all piece images
import blackBishop from '../assets/images/peices/black-bishop.png';
import blackCastle from '../assets/images/peices/black-rook.png';
import blackKing from '../assets/images/peices/black-king.png';
import blackKnight from '../assets/images/peices/black-knight.png';
import blackPawn from '../assets/images/peices/black-pawn.png';
import blackQueen from '../assets/images/peices/black-queen.png';
import whiteBishop from '../assets/images/peices/white-bishop.png';
import whiteCastle from '../assets/images/peices/white-rook.png';
import whiteKing from '../assets/images/peices/white-king.png';
import whiteKnight from '../assets/images/peices/white-knight.png';
import whitePawn from '../assets/images/peices/white-pawn.png';
import whiteQueen from '../assets/images/peices/white-queen.png';

const ChessBoard = ({ pieces, onSquareClick, allowedMoves, clickedSquare, lastMove, capturedPieces, turn, gameOptions }) => {
  console.log('ChessBoard rendering with', pieces.length, 'pieces');
  
  const [captureSquare, setCaptureSquare] = useState(null);
  const [animatingPiece, setAnimatingPiece] = useState(null);
  const [justCapturedIndex, setJustCapturedIndex] = useState(null);
  const [previousCapturedCount, setPreviousCapturedCount] = useState({
    white: 0,
    black: 0
  });
  
  // Track captures and trigger animations
  useEffect(() => {
    const currentWhiteCount = capturedPieces.white.length;
    const currentBlackCount = capturedPieces.black.length;
    
    // Check if a new piece was captured
    if (currentWhiteCount > previousCapturedCount.white) {
      // White captured a black piece
      const newPiece = capturedPieces.white[currentWhiteCount - 1];
      handleCapture(newPiece, 'white');
    } else if (currentBlackCount > previousCapturedCount.black) {
      // Black captured a white piece
      const newPiece = capturedPieces.black[currentBlackCount - 1];
      handleCapture(newPiece, 'black');
    }
    
    setPreviousCapturedCount({
      white: currentWhiteCount,
      black: currentBlackCount
    });
  }, [capturedPieces]);
  
  const handleCapture = (piece, capturedBy) => {
    // Find the square where the capture happened (last move destination)
    if (lastMove.length > 0) {
      const capturePosition = lastMove[lastMove.length - 1];
      
      // Blink the square red
      setCaptureSquare(capturePosition);
      
      // Get square position for animation
      const squareElement = document.querySelector(`[data-position="${capturePosition}"]`);
      const boardWrapper = document.querySelector('.board-wrapper');
      const captureAreaId = capturedBy === 'white' ? 'capture-area-white' : 'capture-area-black';
      const captureArea = document.getElementById(captureAreaId);
      
      if (squareElement && boardWrapper && captureArea) {
        const squareRect = squareElement.getBoundingClientRect();
        const boardRect = boardWrapper.getBoundingClientRect();
        const captureRect = captureArea.getBoundingClientRect();
        
        // Calculate positions relative to board wrapper
        const startX = squareRect.left - boardRect.left + squareRect.width / 2;
        const startY = squareRect.top - boardRect.top + squareRect.height / 2;
        const endX = captureRect.left - boardRect.left + captureRect.width / 2;
        const endY = captureRect.top - boardRect.top + captureRect.height / 2;
        
        setAnimatingPiece({
          image: getPieceImage(piece.color, piece.rank),
          startX: startX,
          startY: startY,
          endX: endX,
          endY: endY,
          capturedBy: capturedBy
        });
        
        // Mark the just-captured piece for fade-in animation
        const newIndex = capturedBy === 'white' ? 
          capturedPieces.white.length - 1 : 
          capturedPieces.black.length - 1;
        
        setJustCapturedIndex({ side: capturedBy, index: newIndex });
        
        // Clear animations after completion
        setTimeout(() => {
          setCaptureSquare(null);
          setAnimatingPiece(null);
        }, 800);
        
        // Clear the just-captured marker after fade-in completes
        setTimeout(() => {
          setJustCapturedIndex(null);
        }, 1200);
      }
    }
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
        const isCaptureSquare = captureSquare === position;
        
        // Determine square color
        const isLightSquare = isEvenRow ? col % 2 === 0 : col % 2 !== 0;
        
        let squareClass = 'square';
        if (isLightSquare) squareClass += ' light';
        else squareClass += ' dark';
        if (isAllowed) squareClass += ' allowed';
        if (isClicked) squareClass += ' clicked-square';
        if (isCaptureSquare) squareClass += ' capture-blink';
        if (isLastMove) {
          // If it's white's turn now, black just moved (use light blue)
          // If it's black's turn now, white just moved (use yellow)
          squareClass += turn === 'white' ? ' last-move-black' : ' last-move-white';
        }
        
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
      <div className="captured-pieces captured-top-left" id="capture-area-black">
        {capturedPieces.black.map((piece, index) => (
          <img
            key={`${piece.name}-${index}`}
            src={getPieceImage(piece.color, piece.rank)}
            alt={`captured ${piece.color} ${piece.rank}`}
            className={`captured-piece ${
              justCapturedIndex?.side === 'black' && justCapturedIndex?.index === index 
                ? 'just-captured' 
                : ''
            }`}
          />
        ))}
      </div>

      <div className="board-container">
        {/* Background image layer */}
        <div className="board-background" style={{ backgroundImage: `url(${boardImage})` }}></div>
        
        {/* Animating captured piece */}
        {animatingPiece && (
          <img
            src={animatingPiece.image}
            className="animating-capture"
            style={{
              left: `${animatingPiece.startX}px`,
              top: `${animatingPiece.startY}px`,
              '--end-x': `${animatingPiece.endX}px`,
              '--end-y': `${animatingPiece.endY}px`
            }}
            alt="captured piece"
          />
        )}
        
        {/* Actual board with squares */}
        <div id="board">
          {renderBoard()}
        </div>
      </div>

      {/* Captured pieces by white (black pieces taken) - bottom right */}
      <div className="captured-pieces captured-bottom-right" id="capture-area-white">
        {capturedPieces.white.map((piece, index) => (
          <img
            key={`${piece.name}-${index}`}
            src={getPieceImage(piece.color, piece.rank)}
            alt={`captured ${piece.color} ${piece.rank}`}
            className={`captured-piece ${
              justCapturedIndex?.side === 'white' && justCapturedIndex?.index === index 
                ? 'just-captured' 
                : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;
