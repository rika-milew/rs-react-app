import { useState, useCallback, useEffect } from 'react';

type UsePagination = {
  page: number;
  totalPages: number;
  setPage: (value: number) => void;
  setTotalPages: (value: number) => void;
  handlePrevious: () => void;
  handleNext: () => void;
};

function getPageUrl(): number {
  const pageParameters = new URLSearchParams(globalThis.location.search);
  const parsedNumber = Number(pageParameters.get('page'));
  return Number.isFinite(parsedNumber) && parsedNumber > 0 ? parsedNumber : 1;
}

export function usePagination(initialTotalPages: number): UsePagination {
  const [newPage, setNewPageState] = useState(() => getPageUrl() - 1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  useEffect(() => {
    const pageParams = new URLSearchParams(globalThis.location.search);
    pageParams.set('page', String(newPage + 1));
    globalThis.history.pushState(
      {},
      '',
      `${globalThis.location.pathname}?${pageParams.toString()}`
    );
  }, [newPage]);

  useEffect(() => {
    const handlePageState = (): void => {
      const initialPage = getPageUrl();
      const maxPage = totalPages > 0 ? totalPages - 1 : 0;
      setNewPageState(Math.max(0, Math.min(initialPage - 1, maxPage)));
    };
    globalThis.addEventListener('popstate', handlePageState);
    return (): void => {
      globalThis.removeEventListener('popstate', handlePageState);
    };
  }, [totalPages]);

  const setPage = useCallback(
    (value: number) => {
      const maxPage = totalPages > 0 ? totalPages - 1 : value;
      setNewPageState(Math.max(0, Math.min(value, maxPage)));
    },
    [totalPages]
  );

  const handlePrevious = useCallback(() => {
    setNewPageState((previous) => Math.max(0, previous - 1));
  }, []);

  const handleNext = useCallback(() => {
    setNewPageState((previous) => previous + 1);
  }, []);

  const page = newPage;

  return {
    page,
    totalPages,
    setPage,
    setTotalPages,
    handlePrevious,
    handleNext,
  };
}
