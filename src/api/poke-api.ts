import { API_BASE_URL } from '@/constants/constants';
import type { Pokemon, PokemonListResponse, TypeGuard } from '@/types/api';
import { isPokemon, isPokemonListResponse } from '@/types/type-guards';

async function fetchData<T>(
  url: string,
  validator: TypeGuard<T>,
  errorMessage: string
): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(errorMessage);
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

export const getPokemons = (offset: number, limit: number) => {
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

export const getPokemonByName = (name: string) =>
  fetchData<Pokemon>(
    `${API_BASE_URL}/${name.toLowerCase().trim()}`,
    isPokemon,
    'Pokemon not found'
  );
