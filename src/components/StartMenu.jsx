import React, { useEffect } from 'react';
import './StartMenu.css';

const StartMenu = ({ onStartGame, show }) => {
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
            <div className="select-difficulty-container" style={{ marginBottom: '20px' }}>
              <h2>Nivel de Dificultad</h2>
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
                <option value="beginner">Principiante - Para nuevos jugadores</option>
                <option value="casual">Casual - Jugador aficionado</option>
                <option value="intermediate">Intermedio - Jugador de club</option>
                <option value="advanced">Avanzado - Jugador fuerte</option>
                <option value="master">Maestro - Nivel de motor</option>
              </select>
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
