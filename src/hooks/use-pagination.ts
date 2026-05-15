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

function boundPageIndex(page: number, totalPages: number): number {
  return Math.max(0, Math.min(page, totalPages - 1));
}

export function usePagination(totalPages: number): UsePagination {
  const [newPage, setNewPageState] = useState(getPageUrl);

  useEffect(() => {
    const handlePageState = (): void => {
      setNewPageState(getPageUrl());
    };
    globalThis.addEventListener('popstate', handlePageState);
    return (): void => {
      globalThis.removeEventListener('popstate', handlePageState);
    };
  }, []);

  const setPageUrl = useCallback((currentPage: number) => {
    const pageParams = new URLSearchParams(globalThis.location.search);
    pageParams.set('page', String(currentPage + 1));
    globalThis.history.pushState(
      {},
      '',
      `${globalThis.location.pathname}?${pageParams.toString()}`
    );
  }, []);

  const setPage = useCallback(
    (value: number) => {
      const pageIndex = Math.max(0, value);
      setPageUrl(pageIndex);
      setNewPageState(pageIndex);
    },
    [setPageUrl]
  );

  const handlePrevious = useCallback(() => {
    setNewPageState((previous) => {
      const newPage = Math.max(0, previous - 1);
      setPageUrl(newPage);
      return newPage;
    });
  }, [setPageUrl]);

  const handleNext = useCallback(() => {
    setNewPageState((previous) => {
      const newPage = previous + 1;
      setPageUrl(newPage);
      return newPage;
    });
  }, [setPageUrl]);

  const page = boundPageIndex(newPage, totalPages);

  return { page, setPage, handlePrevious, handleNext };
}
