import pLimit from 'p-limit';
import { API_CONCURRENCY } from '@/constants/constants';
import { getItems, getItemFull } from '@/services/api';
import { ApiError } from '@/services/api-error';
import { CARD_LIMIT, HTTP_STATUS, API_STATUS } from '@/constants/constants';

import type { PokemonWithDescription } from '@/types/api';

export type Result =
  | {
      type: typeof API_STATUS.SUCCESS;
      data: PokemonWithDescription[];
      totalPages: number;
    }
  | { type: typeof API_STATUS.NOT_FOUND }
  | { type: typeof API_STATUS.ERROR; message: string };

export async function getData(
  page: number,
  searchQuery?: string
): Promise<Result> {
  try {
    let data: PokemonWithDescription[] = [];
    let totalPages = 1;

    const query = searchQuery?.trim().toLowerCase();

    if (query) {
      try {
        const item = await getItemFull(query);
        data = [item];
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status === HTTP_STATUS.NOT_FOUND
        ) {
          return { type: API_STATUS.NOT_FOUND };
        }

        throw error;
      }
    } else {
      const offset = page * CARD_LIMIT;
      const searchData = await getItems(offset, CARD_LIMIT);
      totalPages = Math.ceil(searchData.count / CARD_LIMIT);

      const limit = pLimit(API_CONCURRENCY);

      data = await Promise.all(
        searchData.results.map((item) => limit(() => getItemFull(item.name)))
      );
    }

    if (data.length === 0) {
      return { type: API_STATUS.NOT_FOUND };
    }

    return { type: API_STATUS.SUCCESS, data, totalPages };
  } catch (error) {
    let message = 'Something went wrong. Try again later.';

    if (error instanceof ApiError) {
      if (error.status === HTTP_STATUS.NOT_FOUND) {
        message = 'Pokemon not found';
      } else if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        message = 'Server error. Try again later.';
      } else if (error.status === HTTP_STATUS.NETWORK_ERROR) {
        message = 'Network error. Check your internet connection.';
      }
    }

    return { type: API_STATUS.ERROR, message };
  }
}
