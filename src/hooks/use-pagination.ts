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
    const handlePageState = (): void => {
      const initialPage = getPageUrl();
      setNewPageState(Math.max(0, Math.min(initialPage - 1, totalPages - 1)));
    };
    globalThis.addEventListener('popstate', handlePageState);
    return (): void => {
      globalThis.removeEventListener('popstate', handlePageState);
    };
  }, [totalPages]);

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
      const pageIndex = Math.max(0, Math.min(value, totalPages - 1));
      setPageUrl(pageIndex);
      setNewPageState(pageIndex);
    },
    [setPageUrl, totalPages]
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
      const newPage = Math.min(previous + 1, totalPages - 1);
      setPageUrl(newPage);
      return newPage;
    });
  }, [setPageUrl, totalPages]);

  const page = newPage;

  return { page, setPage, handlePrevious, handleNext };
}
