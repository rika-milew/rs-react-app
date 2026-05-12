import { useState } from 'react';

type UsePagination = {
  page: number;
  setPage: (value: number) => void;
  handlePrevious: () => void;
  handleNext: () => void;
};

export function usePagination(totalPages: number): UsePagination {
  const [page, setPageState] = useState(0);

  const setPage = (value: number): void => {
    setPageState(Math.max(0, Math.min(value, totalPages - 1)));
  };

  const handlePrevious = (): void => {
    setPageState((previous) => Math.max(previous - 1, 0));
  };

  const handleNext = (): void => {
    setPageState((previous) => Math.min(previous + 1, totalPages - 1));
  };
  return {
    page,
    setPage,
    handlePrevious,
    handleNext,
  };
}
