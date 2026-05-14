import { useState } from 'react';

type UseLocalStorage = readonly [string, (value: string) => void];

export const useLocalStorage = (
  key: string,
  initialValue = ''
): UseLocalStorage => {
  const [value, setValue] = useState(() => {
    try {
      const savedSearch = localStorage.getItem(key);
      return savedSearch?.trim() ? savedSearch : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setSavedValue = (newSearch: string): void => {
    try {
      if (newSearch.trim()) {
        localStorage.setItem(key, newSearch);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('localStorage save failed:', error);
      }
    }

    setValue(newSearch);
  };

  return [value, setSavedValue] as const;
};
