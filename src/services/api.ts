import pLimit from 'p-limit';
import { API_BASE_URL, API_CONCURRENCY } from '@/constants/constants';
import type {
  Pokemon,
  PokemonListResponse,
  TypeGuard,
  PokemonWithDescription,
  PokemonSpecies,
} from '@/types/api';
import {
  isValidItem,
  isValidListResponse,
  isValidItemSpecies,
} from '@/types/type-guards';

import { ApiError } from '@/services/api-error';

const TIMEOUT_MS = 20_000;

async function fetchData<T>(
  url: string,
  validator: TypeGuard<T>,
  errorMessage: string,
  timeoutMs: number = TIMEOUT_MS,
): Promise<T> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, timeoutMs);

  try {
    const res = await fetch(url, {
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new ApiError(res.status, errorMessage);
    }

    let data: unknown;

    try {
      data = await res.json();
    } catch {
      throw new Error('Invalid JSON response');
    }

    if (!validator(data)) {
      throw new Error('Invalid API response shape');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }

    throw error;
  }
}

export const getItems = (
  offset: number,
  limit: number,
): Promise<PokemonListResponse> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  return fetchData<PokemonListResponse>(
    `${API_BASE_URL}?${params.toString()}`,
    isValidListResponse,
    'Failed to get items',
  );
};

export const getItemByName = (name: string): Promise<Pokemon> =>
  fetchData<Pokemon>(
    `${API_BASE_URL}/${name.toLowerCase().trim()}`,
    isValidItem,
    'Pokemon not found',
  );

export const getItemSpecies = (url: string): Promise<PokemonSpecies> =>
  fetchData<PokemonSpecies>(
    url,
    isValidItemSpecies,
    'Failed to get item species',
  );

export const getItemFull = async (
  identifier: string,
): Promise<PokemonWithDescription> => {
  const item = await getItemByName(identifier);
  let description = '';

  try {
    const speciesUrl = item.species.url;
    const species = await getItemSpecies(speciesUrl);
    const entries = species.flavor_text_entries;
    const entry = entries.find((item) => item.language.name === 'en');
    description = entry ? entry.flavor_text.replaceAll(/\f|\n/g, ' ') : '';
  } catch (error) {
    console.error(`Failed to fetch species for ${identifier}:`, error);
  }

  return {
    ...item,
    description,
  };
};

export const getItemsById = async (
  selectedIds: string[],
): Promise<PokemonWithDescription[]> => {
  const limit = pLimit(API_CONCURRENCY);

  const promises = selectedIds.map((id) =>
    limit(async () => {
      try {
        return await getItemFull(id);
      } catch (error) {
        console.error(`Failed to fetch pokemon ${id}:`, error);
        return null;
      }
    }),
  );

  const results = await Promise.all(promises);

  return results.filter(
    (item): item is PokemonWithDescription => item !== null,
  );
};
