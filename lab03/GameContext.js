import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, setState] = useState({
    score: 0, taps: 0, doubleTaps: 0, longPresses: 0,
    drags: 0, swipesRight: 0, swipesLeft: 0, pinches: 0, isDarkTheme: false,
  });

  const addScore = (points) => setState(p => ({ ...p, score: p.score + points }));
  
  const registerGesture = (gesture) => {
    setState(p => ({ ...p, [gesture]: p[gesture] + 1 }));
  };

  const toggleTheme = () => setState(p => ({ ...p, isDarkTheme: !p.isDarkTheme }));

  return (
    <GameContext.Provider value={{ ...state, addScore, registerGesture, toggleTheme }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);