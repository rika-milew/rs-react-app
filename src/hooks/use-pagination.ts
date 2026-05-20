import { useState, useCallback, useEffect } from 'react';

type UsePagination = {
  page: number;
  setPage: (value: number) => void;
  handlePrevious: () => void;
  handleNext: () => void;
};

function getPageUrl(): number {
  const pageParameters = new URLSearchParams(globalThis.location.search);
  const parsedNumber = Number(pageParameters.get('page'));
  return Number.isFinite(parsedNumber) && parsedNumber > 0 ? parsedNumber : 1;
}

export function usePagination(totalPages: number): UsePagination {
  const [newPage, setNewPageState] = useState(() => getPageUrl() - 1);

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
      setNewPageState(Math.max(0, Math.min(initialPage - 1, totalPages - 1)));
    };
    globalThis.addEventListener('popstate', handlePageState);
    return (): void => {
      globalThis.removeEventListener('popstate', handlePageState);
    };
  }, [totalPages]);

  const setPage = useCallback(
    (value: number) => {
      setNewPageState(Math.max(0, Math.min(value, totalPages - 1)));
    },
    [totalPages]
  );

  const handlePrevious = useCallback(() => {
    setNewPageState((previous) => Math.max(0, previous - 1));
  }, []);

  const handleNext = useCallback(() => {
    setNewPageState((previous) => Math.min(previous + 1, totalPages - 1));
  }, [totalPages]);

  const page = newPage;

  return { page, setPage, handlePrevious, handleNext };
}
