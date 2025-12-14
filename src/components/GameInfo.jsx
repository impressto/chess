import React from 'react';
import './GameInfo.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const UndoIcon = () => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ marginRight: '6px' }}
  >
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
  </svg>
);

const GameInfo = ({ turn, gameState, onUndo, onNewGame, gameOptions }) => {
  const { t } = useLanguage();
  
  return (
    <div className="game-info">
      <div className="game-controls">
        {gameOptions.opponent !== 'ai' && (
          <button className="button undo-button" onClick={onUndo}>
            <UndoIcon />
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
