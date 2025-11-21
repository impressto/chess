import React from 'react';
import './EndGameModal.css';

const EndGameModal = ({ winner, show, onNewGame }) => {
  if (!show) return null;

  const getWinnerText = () => {
    if (winner === 'white') return 'Blanco Gana!';
    if (winner === 'black') return 'Negro Gana!';
    return `${winner} Gana!`;
  };

  return (
    <div className="scene show" id="endscene">
      <div className="overlay"></div>
      <div className="scene-content">
        <p className="winning-sign">{getWinnerText()}</p>
        <button className="button button-big" onClick={onNewGame} style={{ marginTop: '30px' }}>
          Juego Nuevo
        </button>
      </div>
    </div>
  );
};

export default EndGameModal;
