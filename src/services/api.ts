import { API_BASE_URL } from '@/constants/constants';
import type {
  Pokemon,
  PokemonListResponse,
  TypeGuard,
  PokemonWithDescription,
  PokemonSpecies,
} from '@/types/api';
import {
  isPokemon,
  isPokemonListResponse,
  isPokemonSpecies,
} from '@/types/type-guards';

import { ApiError } from '@/services/api-error';

async function fetchData<T>(
  url: string,
  validator: TypeGuard<T>,
  errorMessage: string
): Promise<T> {
  const res = await fetch(url);

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
}

export const getPokemons = (
  offset: number,
  limit: number
): Promise<PokemonListResponse> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  return fetchData<PokemonListResponse>(
    `${API_BASE_URL}?${params.toString()}`,
    isPokemonListResponse,
    'Failed to get pokemons'
  );
};

export const getPokemonByName = (name: string): Promise<Pokemon> =>
  fetchData<Pokemon>(
    `${API_BASE_URL}/${name.toLowerCase().trim()}`,
    isPokemon,
    'Pokemon not found'
  );

export const getPokemonSpecies = (url: string): Promise<PokemonSpecies> =>
  fetchData<PokemonSpecies>(
    url,
    isPokemonSpecies,
    'Failed to get pokemon species'
  );

export const getPokemonFull = async (
  name: string
): Promise<PokemonWithDescription> => {
  const pokemon = await getPokemonByName(name);

  const speciesUrl = pokemon.species.url;

  const species = await getPokemonSpecies(speciesUrl);

  const entries = species.flavor_text_entries;

  const entry = entries.find((item) => item.language.name === 'en');

  const description = entry ? entry.flavor_text.replaceAll(/\f|\n/g, ' ') : '';

  return {
    ...pokemon,
    description,
  };
};
