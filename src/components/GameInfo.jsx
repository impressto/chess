import React from 'react';
import './GameInfo.css';

const GameInfo = ({ turn, gameState, onUndo, onNewGame }) => {
  return (
    <div className="game-info">
      <div id="turn" className="turn-indicator">
        {turn === 'white' ? "Le toca a las blancas" : "Le toca a las negras"}
        {gameState === 'ai_thinking' && ' (pensando...)'}
      </div>
      <div className="game-controls">
        <button className="button" onClick={onUndo}>
          deshacer movimiento
        </button>
        <button className="button" onClick={onNewGame}>
          Juego Nuevo
        </button>
      </div>
    </div>
  );
};

export default GameInfo;
