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
    front_default: string;
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
    type: {
      name: string;
    };
  }[];
};

export type TypeGuard<T> = (data: unknown) => data is T;
