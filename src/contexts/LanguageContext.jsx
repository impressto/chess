import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Start Menu
    playAgainst: 'Play Against',
    oneVsOne: 'Human',
    ai: 'AI',
    difficultyLevel: 'Difficulty Level',
    beginner: 'Beginner - For new players',
    casual: 'Casual - Hobby player',
    intermediate: 'Intermediate - Club player',
    advanced: 'Advanced - Strong player',
    master: 'Master - Engine level',
    selectColor: 'Select Your Color',
    white: 'White',
    black: 'Black',
    
    // End Game
    whiteWins: 'White Wins!',
    blackWins: 'Black Wins!',
    newGame: 'New Game',
    
    // Game Info
    undoMove: 'Undo Move',
    
    // App
    title: 'Barbarian Chess Game'
  },
  es: {
    // Start Menu
    playAgainst: 'Jugar Contra',
    oneVsOne: 'Humano',
    ai: 'AI',
    difficultyLevel: 'Nivel de Dificultad',
    beginner: 'Principiante - Para nuevos jugadores',
    casual: 'Casual - Jugador aficionado',
    intermediate: 'Intermedio - Jugador de club',
    advanced: 'Avanzado - Jugador fuerte',
    master: 'Maestro - Nivel de motor',
    selectColor: 'Selecciona Tu Color',
    white: 'Blanco',
    black: 'Negro',
    
    // End Game
    whiteWins: 'Blanco Gana!',
    blackWins: 'Negro Gana!',
    newGame: 'Juego Nuevo',
    
    // Game Info
    undoMove: 'Deshacer Movimiento',
    
    // App
    title: 'Juego de ajedrez bárbaro'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    return localStorage.getItem('chess-language') || 'en';
  });

  useEffect(() => {
    // Save language preference
    localStorage.setItem('chess-language', language);
    // Update document title
    document.title = translations[language].title;
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
