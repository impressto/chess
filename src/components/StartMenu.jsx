import React, { useEffect } from 'react';
import './StartMenu.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const StartMenu = ({ onStartGame, show }) => {
  const { t } = useLanguage();
  const [opponent, setOpponent] = React.useState(null);
  const [playerColor, setPlayerColor] = React.useState(null);
  const [difficulty, setDifficulty] = React.useState('intermediate');

  // Reset state when menu is shown
  useEffect(() => {
    if (show) {
      setOpponent(null);
      setPlayerColor(null);
      setDifficulty('intermediate');
    }
  }, [show]);

  const handleOpponentChange = (newOpponent) => {
    setOpponent(newOpponent);
    if (newOpponent === 'human') {
      // Start game immediately when selecting human vs human
      onStartGame({ opponent: newOpponent, playerColor: 'white' });
    }
  };

  const handleColorChange = (color) => {
    setPlayerColor(color);
    // Start game immediately when selecting a color (AI mode) - always use Stockfish
    onStartGame({ opponent: 'ai', playerColor: color, aiEngine: 'stockfish', difficulty });
  };

  if (!show) return null;

  return (
    <div className="scene show">
      <div className="overlay"></div>
      <div className="scene-content">
        <div id="opponent-selection">
          <h2>{t('playAgainst')}</h2>
          <input
            type="radio"
            name="opponent"
            id="humanOpponent"
            value="human"
            checked={opponent === 'human'}
            onChange={(e) => handleOpponentChange(e.target.value)}
          />
          <label htmlFor="humanOpponent">{t('oneVsOne')}</label>
          &ensp;
          <input
            type="radio"
            name="opponent"
            id="aiOpponent"
            value="ai"
            checked={opponent === 'ai'}
            onChange={(e) => handleOpponentChange(e.target.value)}
          />
          <label htmlFor="aiOpponent">{t('ai')}</label>
        </div>

        {opponent === 'ai' && (
          <>
            <div className="select-difficulty-container">
              <h2>{t('difficultyLevel')}</h2>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '2px solid #8b4513',
                  backgroundColor: '#f5e6d3',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                <option value="beginner">{t('beginner')}</option>
                <option value="casual">{t('casual')}</option>
                <option value="intermediate">{t('intermediate')}</option>
                <option value="advanced">{t('advanced')}</option>
                <option value="master">{t('master')}</option>
              </select>
            </div>

            <div className="select-color-container" style={{ marginBottom: '50px' }}>
              <h2>{t('selectColor')}</h2>
              <input
                type="radio"
                name="playerColor"
                id="playerColorWhite"
                value="white"
                checked={playerColor === 'white'}
                onChange={(e) => handleColorChange(e.target.value)}
              />
              <label htmlFor="playerColorWhite">{t('white')}</label>
              &ensp;
              <input
                type="radio"
                name="playerColor"
                id="playerColorBlack"
                value="black"
                checked={playerColor === 'black'}
                onChange={(e) => handleColorChange(e.target.value)}
              />
              <label htmlFor="playerColorBlack">{t('black')}</label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StartMenu;
