import { useCallback, useRef, useState } from 'react';
import type { PokemonWithDescription } from '@/types/api';
import { getData } from '@/services/data-service';
import { LOADING_DELAY_MS } from '@/constants/constants';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (value: string): string => value.trim().toLowerCase();

type Status = 'loading' | 'error' | 'not-found' | 'success';

type DataList = {
  data: PokemonWithDescription[];
  totalPages: number;
  status: Status;
  error: string | null;
  loadData: (search: string, page: number) => Promise<void>;
};

export function useDataList(): DataList {
  const [data, setData] = useState<PokemonWithDescription[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  const loadData = useCallback(async (searchQuery: string, page: number) => {
    requestId.current += 1;
    const currentRequestId = requestId.current;

    setStatus('loading');
    setError(null);

    try {
      await delay(LOADING_DELAY_MS);

      const result = await getData(page, normalize(searchQuery));

      if (currentRequestId !== requestId.current) {
        return;
      }

      switch (result.type) {
        case 'success': {
          setData(result.data);
          setTotalPages(result.totalPages);
          setStatus('success');
          break;
        }

        case 'not-found': {
          setData([]);
          setTotalPages(1);
          setStatus('not-found');
          break;
        }

        case 'error': {
          setStatus('error');
          setError(result.message);
          break;
        }
      }
    } catch {
      setStatus('error');
      setError('Something went wrong. Try again later.');
    }
  }, []);

  return {
    data,
    totalPages,
    status,
    error,
    loadData,
  };
}
