import { Pokemon, PokemonListResponse } from '@/types/api';

export function isPokemonListResponse(
  data: unknown
): data is PokemonListResponse {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  return Array.isArray(obj.results) && typeof obj.count === 'number';
}

export function isPokemon(data: unknown): data is Pokemon {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.name === 'string' &&
    typeof obj.id === 'number' &&
    typeof obj.sprites === 'object' &&
    obj.sprites !== null
  );
}
