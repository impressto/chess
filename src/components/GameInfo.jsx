import React from 'react';
import './GameInfo.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const GameInfo = ({ turn, gameState, onUndo, onNewGame, gameOptions }) => {
  const { t } = useLanguage();
  
  return (
    <div className="game-info">
      <div className="game-controls">
        {gameOptions.opponent !== 'ai' && (
          <button className="button" onClick={onUndo}>
            {t('undoMove')}
          </button>
        )}
        <button className="button" onClick={onNewGame}>
          {t('newGame')}
        </button>
      </div>
    </div>
  );
};

export default GameInfo;
