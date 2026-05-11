import { getPokemons, getPokemonFull } from '@/services/api';
import { ApiError } from '@/services/api-error';
import { CARD_LIMIT, HTTP_STATUS } from '@/constants/constants';

import type { PokemonWithDescription } from '@/types/api';

export type Result =
  | { type: 'success'; data: PokemonWithDescription[]; totalPages: number }
  | { type: 'not-found' }
  | { type: 'error'; message: string };

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
        const pokemon = await getPokemonFull(query);
        data = [pokemon];
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status === HTTP_STATUS.NOT_FOUND
        ) {
          return { type: 'not-found' };
        }

        throw error;
      }
    } else {
      const offset = page * CARD_LIMIT;

      const searchData = await getPokemons(offset, CARD_LIMIT);

      totalPages = Math.ceil(searchData.count / CARD_LIMIT);

      data = await Promise.all(
        searchData.results.map((item) => getPokemonFull(item.name))
      );
    }

    if (data.length === 0) {
      return { type: 'not-found' };
    }

    return { type: 'success', data, totalPages };
  } catch (error) {
    let message = 'Something went wrong. Try again later.';

    if (error instanceof ApiError) {
      if (error.status === HTTP_STATUS.NOT_FOUND) {
        message = 'Pokemon not found';
      } else if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        message = 'Server error. Try again later.';
      } else if (error.status === 0) {
        message = 'Network error. Check your internet connection.';
      }
    }

    return { type: 'error', message };
  }
}
