import { useState } from 'react';

type UseLocalStorage = readonly [string, (value: string) => void];

export const useLocalStorage = (
  key: string,
  initialValue = ''
): UseLocalStorage => {
  const [value, setValue] = useState(() => {
    const savedSearch = localStorage.getItem(key);

    return savedSearch?.trim() ? savedSearch : initialValue;
  });

  const setSavedValue = (newSearch: string): void => {
    if (newSearch.trim()) {
      localStorage.setItem(key, newSearch);
    } else {
      localStorage.removeItem(key);
    }

    setValue(newSearch);
  };

  return [value, setSavedValue] as const;
};
