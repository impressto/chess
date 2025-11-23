import React from 'react';
import './GameInfo.css';

const GameInfo = ({ turn, gameState, onUndo, onNewGame }) => {
  return (
    <div className="game-info">
      <div className="game-controls">
        <button className="button" onClick={onUndo}>
          Deshacer Movimiento
        </button>
        <button className="button" onClick={onNewGame}>
          Juego Nuevo
        </button>
      </div>
    </div>
  );
};

export default GameInfo;
