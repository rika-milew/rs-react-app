import pLimit from 'p-limit';
import {
  API_CONCURRENCY,
  ERROR_MESSAGES,
  MAX_ITEMS,
  CARD_LIMIT,
  HTTP_STATUS,
  API_STATUS,
} from '@/constants/constants';
import { getItems, getItemFull } from '@/services/api';
import { isValidListResponse } from '@/types/type-guards';
import { ApiError } from '@/services/api-error';

import type { PokemonWithDescription, ApiResult } from '@/types/api';

export type Result = ApiResult<
  PokemonWithDescription[],
  { totalPages: number }
>;

export async function getData(
  page: number,
  searchQuery?: string,
): Promise<Result> {
  try {
    let data: PokemonWithDescription[] = [];
    let totalPages = 1;

    const query = searchQuery?.trim().toLowerCase();

    if (query) {
      try {
        const item = await getItemFull(query);
        data = [item];
        totalPages = 1;
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status === HTTP_STATUS.NOT_FOUND
        ) {
          return { status: API_STATUS.NOT_FOUND };
        }

        throw error;
      }
    } else {
      const offset = page * CARD_LIMIT;
      const searchData = await getItems(offset, CARD_LIMIT);

      if (!isValidListResponse(searchData)) {
        return { status: API_STATUS.ERROR, message: ERROR_MESSAGES.DEFAULT };
      }

      totalPages = Math.ceil(
        Math.min(searchData.count, MAX_ITEMS) / CARD_LIMIT,
      );

      const limit = pLimit(API_CONCURRENCY);

      data = await Promise.all(
        searchData.results.map((item) => limit(() => getItemFull(item.name))),
      );
    }

    if (data.length === 0) {
      return { status: API_STATUS.NOT_FOUND };
    }

    return { status: API_STATUS.SUCCESS, data, totalPages };
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

    return { status: API_STATUS.ERROR, message };
  }
}
