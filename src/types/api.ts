export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonListItem[];
  next: string | null;
  previous: string | null;
  count: number;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
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
}

export type TypeGuard<T> = (data: unknown) => data is T;
