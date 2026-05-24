import { createContext, useContext } from 'react';

type Theme = 'light' | 'dark';

type ThemeContext = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContext | null>(null);

export const useTheme = (): ThemeContext => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme error');
  }
  return context;
};
