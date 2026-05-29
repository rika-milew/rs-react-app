import { useState, useEffect } from 'react';
import { getItemFull } from '@/services/api';
import { ApiError } from '@/services/api-error';
import { HTTP_STATUS, API_STATUS, ERROR_MESSAGES } from '@/constants/constants';
import type { PokemonWithDescription, ApiResult } from '@/types/api';

export type DetailResult = ApiResult<PokemonWithDescription>;

export function useDetailData(id: string | null): DetailResult | null {
  const [result, setResult] = useState<DetailResult | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;

    const getDetails = async (): Promise<void> => {
      setResult({ status: API_STATUS.LOADING });

      try {
        const item = await getItemFull(id);

        if (!cancelled) {
          setResult({ status: API_STATUS.SUCCESS, data: item });
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (
          error instanceof ApiError &&
          error.status === HTTP_STATUS.NOT_FOUND
        ) {
          setResult({ status: API_STATUS.NOT_FOUND });
          return;
        }

        let message: string = ERROR_MESSAGES.DEFAULT;

        if (error instanceof ApiError) {
          if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
            message = ERROR_MESSAGES.SERVER;
          } else if (error.status === HTTP_STATUS.NETWORK_ERROR) {
            message = ERROR_MESSAGES.NETWORK;
          }
        } else if (error instanceof Error) {
          message = error.message;
        }

        setResult({ status: API_STATUS.ERROR, message });
      }
    };

    void getDetails();

    return (): void => {
      cancelled = true;
    };
  }, [id]);

  return result;
}
