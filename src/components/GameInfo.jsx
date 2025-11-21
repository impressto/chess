import React from 'react';
import './GameInfo.css';

const GameInfo = ({ turn, gameState, onUndo, onNewGame }) => {
  return (
    <div className="game-info">
      <div id="turn" className="turn-indicator">
        {turn === 'white' ? "White's Turn" : "Black's Turn"}
        {gameState === 'ai_thinking' && ' (thinking...)'}
      </div>
      <div className="game-controls">
        <button className="button" onClick={onUndo}>
          Undo Move
        </button>
        <button className="button" onClick={onNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameInfo;
