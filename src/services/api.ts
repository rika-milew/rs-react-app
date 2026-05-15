import { API_BASE_URL } from '@/constants/constants';
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
  timeoutMs: number = TIMEOUT_MS
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
  limit: number
): Promise<PokemonListResponse> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  return fetchData<PokemonListResponse>(
    `${API_BASE_URL}?${params.toString()}`,
    isValidListResponse,
    'Failed to get items'
  );
};

export const getItemByName = (name: string): Promise<Pokemon> =>
  fetchData<Pokemon>(
    `${API_BASE_URL}/${name.toLowerCase().trim()}`,
    isValidItem,
    'Pokemon not found'
  );

export const getItemSpecies = (url: string): Promise<PokemonSpecies> =>
  fetchData<PokemonSpecies>(
    url,
    isValidItemSpecies,
    'Failed to get item species'
  );

export const getItemFull = async (
  name: string
): Promise<PokemonWithDescription> => {
  const item = await getItemByName(name);

  const speciesUrl = item.species.url;

  const species = await getItemSpecies(speciesUrl);

  const entries = species.flavor_text_entries;

  const entry = entries.find((item) => item.language.name === 'en');

  const description = entry ? entry.flavor_text.replaceAll(/\f|\n/g, ' ') : '';

  return {
    ...item,
    description,
  };
};
