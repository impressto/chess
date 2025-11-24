import React from 'react';
import './EndGameModal.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const EndGameModal = ({ winner, show, onNewGame }) => {
  const { t } = useLanguage();
  
  if (!show) return null;

  const getWinnerText = () => {
    if (winner === 'white') return t('whiteWins');
    if (winner === 'black') return t('blackWins');
    return `${winner} ${t('wins')}`;
  };

  return (
    <div className="scene show" id="endscene">
      <div className="overlay"></div>
      <div className="scene-content">
        <p className="winning-sign">{getWinnerText()}</p>
        <button className="button button-big" onClick={onNewGame} style={{ marginTop: '30px' }}>
          {t('newGame')}
        </button>
      </div>
    </div>
  );
};

export default EndGameModal;
