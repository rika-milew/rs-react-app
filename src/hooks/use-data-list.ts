import { useCallback, useRef, useState } from 'react';
import type { PokemonWithDescription } from '@/types/api';
import { getData } from '@/services/data-service';
import {
  LOADING_DELAY_MS,
  API_STATUS,
  ERROR_MESSAGES,
} from '@/constants/constants';
import type { ApiStatus } from '@/constants/constants';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (value: string): string => value.trim().toLowerCase();

type DataList = {
  data: PokemonWithDescription[];
  totalPages: number;
  status: ApiStatus;
  error: string | null;
  loadData: (search: string, page: number) => Promise<void>;
};

export function useDataList(): DataList {
  const [data, setData] = useState<PokemonWithDescription[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.LOADING);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  const loadData = useCallback(async (searchQuery: string, page: number) => {
    requestId.current += 1;
    const currentRequestId = requestId.current;

    setStatus(API_STATUS.LOADING);
    setError(null);

    try {
      await delay(LOADING_DELAY_MS);

      const result = await getData(page, normalize(searchQuery));

      if (currentRequestId !== requestId.current) {
        return;
      }

      switch (result.status) {
        case API_STATUS.SUCCESS: {
          setData(result.data);
          setTotalPages(result.totalPages);
          setStatus(API_STATUS.SUCCESS);
          break;
        }

        case API_STATUS.NOT_FOUND: {
          setData([]);
          setTotalPages(1);
          setStatus(API_STATUS.NOT_FOUND);
          break;
        }

        case API_STATUS.ERROR: {
          setStatus(API_STATUS.ERROR);
          setError(result.message);
          break;
        }
      }
    } catch {
      if (currentRequestId !== requestId.current) {
        return;
      }

      setStatus(API_STATUS.ERROR);
      setError(ERROR_MESSAGES.DEFAULT);
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
