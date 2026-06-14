import type {
  Pokemon,
  PokemonListItem,
  PokemonListResponse,
  PokemonSpecies,
} from '@/types/api';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { VALID_ERROR_STATUSES } from '@/constants/constants';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isValidListItem(data: unknown): data is PokemonListItem {
  if (!isObject(data)) {
    return false;
  }
  const { name, url } = data;
  return typeof name === 'string' && typeof url === 'string';
}

export function isValidListResponse(
  data: unknown,
): data is PokemonListResponse {
  if (!isObject(data)) {
    return false;
  }

  const { results, next, previous, count } = data;

  return (
    Array.isArray(results) &&
    results.every(isValidListItem) &&
    (next === null || typeof next === 'string') &&
    (previous === null || typeof previous === 'string') &&
    typeof count === 'number'
  );
}

export function isValidItem(data: unknown): data is Pokemon {
  if (!isObject(data)) {
    return false;
  }

  const { name, id, sprites, types, abilities, height, weight, species } = data;

  if (
    typeof name !== 'string' ||
    typeof id !== 'number' ||
    !isObject(sprites)
  ) {
    return false;
  }

  if (!isValidSprites(sprites)) {
    return false;
  }

  if (!Array.isArray(types)) {
    return false;
  }

  const areValidTypes = types.every((typeItem: unknown) => {
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

  if (data.abilities !== undefined && !Array.isArray(abilities)) {
    return false;
  }

  if (Array.isArray(abilities)) {
    const areValidAbilities = abilities.every((abilityItem: unknown) => {
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

  if (!isValidSpecies(species)) {
    return false;
  }

  if (typeof height !== 'number' || typeof weight !== 'number') {
    return false;
  }

  return true;
}

function isValidSprites(sprites: unknown): boolean {
  if (!isObject(sprites)) {
    return false;
  }

  const isFrontDefaultImage = typeof sprites.front_default === 'string';
  const isArtworkImage =
    isObject(sprites.other) &&
    isObject(sprites.other['official-artwork']) &&
    typeof sprites.other['official-artwork'].front_default === 'string';

  return isFrontDefaultImage || isArtworkImage;
}

function isValidSpecies(species: unknown): boolean {
  return (
    isObject(species) &&
    typeof species.name === 'string' &&
    typeof species.url === 'string'
  );
}

export function isValidItemSpecies(data: unknown): data is PokemonSpecies {
  if (!isObject(data)) {
    return false;
  }

  const { flavor_text_entries } = data;

  if (!Array.isArray(flavor_text_entries)) {
    return false;
  }

  const areValidEntries = flavor_text_entries.every((item: unknown) => {
    if (!isObject(item)) {
      return false;
    }
    const { flavor_text, language } = item;
    return (
      typeof flavor_text === 'string' &&
      isObject(language) &&
      typeof language.name === 'string'
    );
  });

  if (!areValidEntries) {
    return false;
  }

  const isLanguageEntry = flavor_text_entries.some((item: unknown) => {
    if (!isObject(item)) {
      return false;
    }
    const { language } = item;
    return isObject(language) && language.name === 'en';
  });

  return isLanguageEntry;
}

export function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (typeof error.status === 'number' ||
      (typeof error.status === 'string' &&
        VALID_ERROR_STATUSES.includes(error.status)))
  );
}

export function isSerializedError(error: unknown): error is SerializedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    (typeof error.message === 'string' || error.message === undefined)
  );
}
