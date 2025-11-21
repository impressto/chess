import React, { useEffect } from 'react';
import './StartMenu.css';

const StartMenu = ({ onStartGame, show }) => {
  const [opponent, setOpponent] = React.useState('human');
  const [playerColor, setPlayerColor] = React.useState('white');

  // Reset state when menu is shown
  useEffect(() => {
    if (show) {
      setOpponent('human');
      setPlayerColor('white');
    }
  }, [show]);

  const handleStartGame = () => {
    onStartGame({ opponent, playerColor });
  };

  if (!show) return null;

  return (
    <div className="scene show">
      <div className="overlay"></div>
      <div className="scene-content">
        <div style={{ marginBottom: '50px' }}>
          <h2>Play Against</h2>
          <input
            type="radio"
            name="opponent"
            id="humanOpponent"
            value="human"
            checked={opponent === 'human'}
            onChange={(e) => setOpponent(e.target.value)}
          />
          <label htmlFor="humanOpponent">Human</label>
          &ensp;
          <input
            type="radio"
            name="opponent"
            id="aiOpponent"
            value="ai"
            checked={opponent === 'ai'}
            onChange={(e) => setOpponent(e.target.value)}
          />
          <label htmlFor="aiOpponent">AI</label>
        </div>

        {opponent === 'ai' && (
          <div className="select-color-container" style={{ marginBottom: '50px' }}>
            <h2>Select Your Color</h2>
            <input
              type="radio"
              name="playerColor"
              id="playerColorWhite"
              value="white"
              checked={playerColor === 'white'}
              onChange={(e) => setPlayerColor(e.target.value)}
            />
            <label htmlFor="playerColorWhite">White</label>
            &ensp;
            <input
              type="radio"
              name="playerColor"
              id="playerColorBlack"
              value="black"
              checked={playerColor === 'black'}
              onChange={(e) => setPlayerColor(e.target.value)}
            />
            <label htmlFor="playerColorBlack">Black</label>
          </div>
        )}

        <div className="start-game-container">
          <button className="button button-big" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
