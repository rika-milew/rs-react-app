import type { PokemonWithDescription } from '@/types/api';
import { HTTP_STATUS } from '@/constants/constants';

export const artworkMockImage = '/assets/artwork-mock-image.png';
const mockImage = '/assets/mock-image.png';

export const mockPokemonFull: PokemonWithDescription = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: mockImage,
    other: {
      'official-artwork': {
        front_default: artworkMockImage,
      },
    },
  },
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  abilities: [
    { ability: { name: 'overgrow' }, is_hidden: false },
    { ability: { name: 'chlorophyll' }, is_hidden: true },
  ],
  species: {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
  },
  description:
    'A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.',
};

export const mockPokemonPartial: PokemonWithDescription = {
  id: 2,
  name: 'ivysaur',
  height: 10,
  weight: 130,
  sprites: {
    front_default: mockImage,
    other: {},
  },
  types: [{ type: { name: 'grass' } }],
  abilities: [{ ability: { name: 'overgrow' }, is_hidden: false }],
  species: {
    name: 'ivysaur',
    url: 'https://pokeapi.co/api/v2/pokemon-specqies/2/',
  },
  description: undefined,
};

export function mockFetchData(data: unknown, status = HTTP_STATUS.OK): void {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    Response.json(data, { status })
  );
}

export function mockFetchDataError(
  status = HTTP_STATUS.INTERNAL_SERVER_ERROR
): void {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(null, {
      status,
      statusText: 'Error',
      headers: { 'Content-Type': 'application/json' },
    })
  );
}
