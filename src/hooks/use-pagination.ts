import { useState, useCallback } from 'react';

type UsePagination = {
  page: number;
  setPage: (value: number) => void;
  handlePrevious: () => void;
  handleNext: () => void;
};

export function usePagination(totalPages: number): UsePagination {
  const [page, setPageState] = useState(0);

  const setPage = useCallback(
    (value: number): void => {
      setPageState(Math.max(0, Math.min(value, totalPages - 1)));
    },
    [totalPages]
  );

  const handlePrevious = useCallback((): void => {
    setPageState((previous) => Math.max(previous - 1, 0));
  }, []);

  const handleNext = useCallback((): void => {
    setPageState((previous) => Math.min(previous + 1, totalPages - 1));
  }, [totalPages]);

  return {
    page,
    setPage,
    handlePrevious,
    handleNext,
  };
}
