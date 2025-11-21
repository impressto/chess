import React from 'react';
import './ChessBoard.css';

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

const ChessBoard = ({ pieces, onSquareClick, allowedMoves, clickedSquare, lastMove }) => {
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
    <div id="board">
      {renderBoard()}
    </div>
  );
};

export default ChessBoard;
