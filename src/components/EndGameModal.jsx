import React from 'react';
import './EndGameModal.css';

const EndGameModal = ({ winner, show, onNewGame }) => {
  if (!show) return null;

  return (
    <div className="scene show" id="endscene">
      <div className="overlay"></div>
      <div className="scene-content">
        <p className="winning-sign">{winner} Wins!</p>
        <button className="button button-big" onClick={onNewGame} style={{ marginTop: '30px' }}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default EndGameModal;
