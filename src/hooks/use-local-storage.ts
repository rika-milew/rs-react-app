import { useState, useEffect } from 'react';

type UseLocalStorage = readonly [string | null, (value: string) => void];

export const useLocalStorage = (
  key: string,
  initialValue = ''
): UseLocalStorage => {
  const [value, setValue] = useState(() => {
    try {
      const savedSearch = localStorage.getItem(key);
      return savedSearch ?? initialValue;
    } catch (error) {
      console.error('localStorage read failed:', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (value) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('localStorage save failed:', error);
    }
  }, [key, value]);

  const setSavedValue = (newSearch: string): void => {
    setValue(newSearch.trim() || null);
  };

  return [value, setSavedValue] as const;
};
