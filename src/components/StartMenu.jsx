import React, { useEffect } from 'react';
import './StartMenu.css';

const StartMenu = ({ onStartGame, show }) => {
  const [opponent, setOpponent] = React.useState(null);
  const [playerColor, setPlayerColor] = React.useState(null);
  const [aiEngine, setAiEngine] = React.useState('minimax');

  // Reset state when menu is shown
  useEffect(() => {
    if (show) {
      setOpponent(null);
      setPlayerColor(null);
      setAiEngine('minimax');
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
    // Start game immediately when selecting a color (AI mode)
    onStartGame({ opponent: 'ai', playerColor: color, aiEngine: aiEngine });
  };

  if (!show) return null;

  return (
    <div className="scene show">
      <div className="overlay"></div>
      <div className="scene-content">
        <div id="opponent-selection">
          <h2>Jugar Contra</h2>
          <input
            type="radio"
            name="opponent"
            id="humanOpponent"
            value="human"
            checked={opponent === 'human'}
            onChange={(e) => handleOpponentChange(e.target.value)}
          />
          <label htmlFor="humanOpponent">Uno Contra Otro</label>
          &ensp;
          <input
            type="radio"
            name="opponent"
            id="aiOpponent"
            value="ai"
            checked={opponent === 'ai'}
            onChange={(e) => handleOpponentChange(e.target.value)}
          />
          <label htmlFor="aiOpponent">AI</label>
        </div>

        {opponent === 'ai' && (
          <>
            <div className="select-ai-container" style={{ marginBottom: '20px' }}>
              <h2>Nivel de AI</h2>
              <input
                type="radio"
                name="aiEngine"
                id="aiEngineMinimax"
                value="minimax"
                checked={aiEngine === 'minimax'}
                onChange={(e) => setAiEngine(e.target.value)}
              />
              <label htmlFor="aiEngineMinimax">Fácil (JavaScript)</label>
              &ensp;
              <input
                type="radio"
                name="aiEngine"
                id="aiEngineStockfish"
                value="stockfish"
                checked={aiEngine === 'stockfish'}
                onChange={(e) => setAiEngine(e.target.value)}
              />
              <label htmlFor="aiEngineStockfish">Difícil (Stockfish)</label>
            </div>

            <div className="select-color-container" style={{ marginBottom: '50px' }}>
              <h2>Selecciona Tu Color</h2>
              <input
                type="radio"
                name="playerColor"
                id="playerColorWhite"
                value="white"
                checked={playerColor === 'white'}
                onChange={(e) => handleColorChange(e.target.value)}
              />
              <label htmlFor="playerColorWhite">Blanco</label>
              &ensp;
              <input
                type="radio"
                name="playerColor"
                id="playerColorBlack"
                value="black"
                checked={playerColor === 'black'}
                onChange={(e) => handleColorChange(e.target.value)}
              />
              <label htmlFor="playerColorBlack">Negro</label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StartMenu;
