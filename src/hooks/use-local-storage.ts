import { useState } from 'react';

type UseLocalStorage = readonly [
  string,
  React.Dispatch<React.SetStateAction<string>>,
];

export const useLocalStorage = (
  key: string,
  initialValue = ''
): UseLocalStorage => {
  const [value, setValue] = useState(() => {
    const savedSearch = localStorage.getItem(key);

    return savedSearch?.trim() ? savedSearch : initialValue;
  });

  return [value, setValue] as const;
};
