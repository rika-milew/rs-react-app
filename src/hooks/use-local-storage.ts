'use client';

import { useState, useEffect } from 'react';

type UseLocalStorage = readonly [string, (value: string) => void];

export const useLocalStorage = (
  key: string,
  initialValue = '',
): UseLocalStorage => {
  const [value, setValue] = useState(() => {
    try {
      const savedSearch = localStorage.getItem(key);
      return savedSearch?.trim() ?? initialValue;
    } catch (error) {
      console.error('localStorage read failed:', error);
      return initialValue;
    }
  });

  const setSavedValue = (newSearch: string): void => {
    setValue(newSearch.trim() || initialValue);
  };

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

  return [value, setSavedValue] as const;
};
