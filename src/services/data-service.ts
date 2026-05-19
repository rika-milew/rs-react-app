import pLimit from 'p-limit';
import {
  API_CONCURRENCY,
  ERROR_MESSAGES,
  MAX_ITEMS,
} from '@/constants/constants';
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
      totalPages = Math.ceil(
        Math.min(searchData.count, MAX_ITEMS) / CARD_LIMIT
      );

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
    let message: string = ERROR_MESSAGES.DEFAULT;

    if (error instanceof ApiError) {
      if (error.status === HTTP_STATUS.NOT_FOUND) {
        message = ERROR_MESSAGES.NOTFOUND;
      } else if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        message = ERROR_MESSAGES.SERVER;
      } else if (error.status === HTTP_STATUS.NETWORK_ERROR) {
        message = ERROR_MESSAGES.NETWORK;
      }
    }

    return { type: API_STATUS.ERROR, message };
  }
}
