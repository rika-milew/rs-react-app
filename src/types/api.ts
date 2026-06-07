import type { API_STATUS } from '@/constants/constants';

export type PokemonListItem = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  results: PokemonListItem[];
  next: string | null;
  previous: string | null;
  count: number;
};

export type Pokemon = {
  id: number;
  name: string;
  sprites: {
    front_default?: string;
    other?: {
      ['official-artwork']?: {
        front_default?: string;
      };
    };
  };
  height: number;
  weight: number;

  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];

  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];

  species?: {
    name: string;
    url: string;
  };
};

export type PokemonSpecies = {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
};

export type PokemonWithDescription = Pokemon & {
  description: string | undefined;
};

export type TypeGuard<T> = (data: unknown) => data is T;

export type ApiResult<
  T,
  Extra extends Record<string, unknown> = Record<string, unknown>,
> =
  | ({ status: typeof API_STATUS.SUCCESS; data: T } & Extra)
  | { status: typeof API_STATUS.NOT_FOUND }
  | { status: typeof API_STATUS.ERROR; message: string }
  | { status: typeof API_STATUS.LOADING };
