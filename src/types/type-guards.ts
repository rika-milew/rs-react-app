import type { Pokemon, PokemonListResponse, PokemonSpecies } from '@/types/api';

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

  if (
    typeof name !== 'string' ||
    typeof id !== 'number' ||
    !isObject(sprites)
  ) {
    return false;
  }

  const isFrontDefaultImage = typeof sprites.front_default === 'string';

  const isArtworkImage =
    isObject(sprites.other) &&
    isObject(sprites.other['official-artwork']) &&
    typeof sprites.other['official-artwork'].front_default === 'string';

  if (!isFrontDefaultImage && !isArtworkImage) {
    return false;
  }

  if (!Array.isArray(data.types)) {
    return false;
  }

  const areValidTypes = data.types.every((typeItem: unknown) => {
    if (!isObject(typeItem)) {
      return false;
    }
    const slot = typeItem.slot;
    const type = typeItem.type;
    return (
      typeof slot === 'number' &&
      isObject(type) &&
      typeof type.name === 'string'
    );
  });

  if (!areValidTypes) {
    return false;
  }

  if (data.abilities !== undefined && !Array.isArray(data.abilities)) {
    return false;
  }

  if (Array.isArray(data.abilities)) {
    const areValidAbilities = data.abilities.every((abilityItem: unknown) => {
      if (!isObject(abilityItem)) {
        return false;
      }
      const ability = abilityItem.ability;
      return isObject(ability) && typeof ability.name === 'string';
    });

    if (!areValidAbilities) {
      return false;
    }
  }

  const height = data.height;
  const weight = data.weight;

  if (typeof height !== 'number' || typeof weight !== 'number') {
    return false;
  }

  return true;
}

export function isPokemonSpecies(data: unknown): data is PokemonSpecies {
  if (!isObject(data)) {
    return false;
  }

  const entries = data.flavor_text_entries;

  if (!Array.isArray(entries)) {
    return false;
  }

  return entries.every((item) => {
    if (!isObject(item)) {
      return false;
    }

    const language = item.language;

    return (
      typeof item.flavor_text === 'string' &&
      isObject(language) &&
      typeof language.name === 'string'
    );
  });
}
