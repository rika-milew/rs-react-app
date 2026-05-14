import {
  isPokemonListResponse,
  isPokemon,
  isPokemonSpecies,
} from './type-guards';
import { mockPokemonFull } from '@/test-utils/api-mock';

describe('type guards', () => {
  describe('isPokemonListResponse', () => {
    it('returns true for valid data', () => {
      const data = {
        count: 2,
        next: null,
        previous: null,
        results: [
          { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
          { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
        ],
      };
      expect(isPokemonListResponse(data)).toBe(true);
    });

    it('returns false when results is not array', () => {
      const data = {
        count: 2,
        results: 'charmeleon',
      };

      expect(isPokemonListResponse(data)).toBe(false);
    });

    it('returns false when data is not object', () => {
      expect(isPokemonListResponse(null)).toBe(false);
      expect(isPokemonListResponse(100)).toBe(false);
    });

    it('returns false when count is not number', () => {
      const data = {
        count: '12',
        results: [],
      };

      expect(isPokemonListResponse(data)).toBe(false);
    });
  });

  describe('isPokemon', () => {
    it('returns true for valid data', () => {
      expect(isPokemon(mockPokemonFull)).toBe(true);
    });

    it('returns false when sprites is not object', () => {
      const data = {
        id: 1,
        name: 'bulbasaur',
        sprites: null,
      };

      expect(isPokemon(data)).toBe(false);
    });

    it('returns false when name is missing', () => {
      const data = {
        id: 1,
        sprites: {},
      };

      expect(isPokemon(data)).toBe(false);
    });

    it('returns false when id is not number', () => {
      const data = {
        id: '1',
        name: 'bulbasaur',
        sprites: {},
      };

      expect(isPokemon(data)).toBe(false);
    });
  });

  describe('isPokemonSpecies', () => {
    it('returns true for valid data', () => {
      const data = {
        flavor_text_entries: [
          {
            flavor_text: 'A strange seed was planted on its back at birth.',
            language: { name: 'en' },
          },
        ],
      };

      expect(isPokemonSpecies(data)).toBe(true);
    });

    it('returns false when data is not object', () => {
      expect(isPokemonSpecies(null)).toBe(false);
      expect(isPokemonSpecies('string')).toBe(false);
    });

    it('returns false when entries are invalid objects', () => {
      const data = {
        flavor_text_entries: [null],
      };

      expect(isPokemonSpecies(data)).toBe(false);
    });

    it('returns false when entries is not array', () => {
      const data = {
        flavor_text_entries: {},
      };

      expect(isPokemonSpecies(data)).toBe(false);
    });

    it('returns false when language is missing', () => {
      const data = {
        flavor_text_entries: [
          {
            flavor_text: 'A strange seed was planted on its back at birth.',
            language: null,
          },
        ],
      };

      expect(isPokemonSpecies(data)).toBe(false);
    });
  });
});
