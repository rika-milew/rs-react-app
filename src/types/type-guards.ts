import type { Pokemon, PokemonListResponse } from '@/types/api';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isPokemonListResponse(
  data: unknown
): data is PokemonListResponse {
  if (!isObject(data)) {
    return false;
  }

  const results = data.results;
  const count = data.count;

  return Array.isArray(results) && typeof count === 'number';
}

export function isPokemon(data: unknown): data is Pokemon {
  if (!isObject(data)) {
    return false;
  }

  const name = data.name;
  const id = data.id;
  const sprites = data.sprites;

  return (
    typeof name === 'string' && typeof id === 'number' && isObject(sprites)
  );
}
