'use client';

import { useState, useEffect, useCallback } from 'react';

type UseLocalStorage = readonly [string, (value: string) => void];

export const useLocalStorage = (
  key: string,
  initialValue = '',
): UseLocalStorage => {
  const [value, setValue] = useState(() => {
    try {
      const savedSearch = localStorage.getItem(key);
      return savedSearch?.trim() ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  const setSavedValue = useCallback(
    (newSearch: string): void => {
      setValue(newSearch.trim() || initialValue);
    },
    [initialValue],
  );

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
