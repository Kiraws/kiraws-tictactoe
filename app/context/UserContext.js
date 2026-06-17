'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [playerX, setPlayerX] = useState('Joueur X');
  const [playerO, setPlayerO] = useState('Joueur O');
  const [finalXscore, setFinalXscore] = useState(0);
  const [finalOscore, setFinalOscore] = useState(0);
  const [replayPath, setReplayPath]   = useState('/play');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.classList.toggle('dark', saved === 'dark');
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      localStorage.setItem('theme', next);
      return next;
    });
  };

  return (
    <UserContext.Provider value={{
      playerX, setPlayerX,
      playerO, setPlayerO,
      finalXscore, setFinalXscore,
      finalOscore, setFinalOscore,
      replayPath, setReplayPath,
      theme, toggleTheme,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
