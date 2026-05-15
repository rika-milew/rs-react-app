import {
  isValidListResponse,
  isValidItem,
  isValidItemSpecies,
} from './type-guards';
import { mockItemFull } from '@/test-utils/api-mock';

describe('type guards', () => {
  describe('isValidListResponse', () => {
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
      expect(isValidListResponse(data)).toBe(true);
    });

    it('returns false when results is not array', () => {
      const data = {
        count: 2,
        results: 'charmeleon',
      };

      expect(isValidListResponse(data)).toBe(false);
    });

    it('returns false when data is not object', () => {
      expect(isValidListResponse(null)).toBe(false);
      expect(isValidListResponse(100)).toBe(false);
    });

    it('returns false when count is not number', () => {
      const data = {
        count: '12',
        results: [],
      };

      expect(isValidListResponse(data)).toBe(false);
    });
  });

  describe('isValidItem', () => {
    it('returns true for valid data', () => {
      expect(isValidItem(mockItemFull)).toBe(true);
    });

    it('returns false when sprites is not object', () => {
      const data = {
        id: 1,
        name: 'bulbasaur',
        sprites: null,
      };

      expect(isValidItem(data)).toBe(false);
    });

    it('returns false when name is missing', () => {
      const data = {
        id: 1,
        sprites: {},
      };

      expect(isValidItem(data)).toBe(false);
    });

    it('returns false when id is not number', () => {
      const data = {
        id: '1',
        name: 'bulbasaur',
        sprites: {},
      };

      expect(isValidItem(data)).toBe(false);
    });
  });

  describe('isItemSpecies', () => {
    it('returns true for valid data', () => {
      const data = {
        flavor_text_entries: [
          {
            flavor_text: 'A strange seed was planted on its back at birth.',
            language: { name: 'en' },
          },
        ],
      };

      expect(isValidItemSpecies(data)).toBe(true);
    });

    it('returns false when data is not object', () => {
      expect(isValidItemSpecies(null)).toBe(false);
      expect(isValidItemSpecies('string')).toBe(false);
    });

    it('returns false when entries are invalid objects', () => {
      const data = {
        flavor_text_entries: [null],
      };

      expect(isValidItemSpecies(data)).toBe(false);
    });

    it('returns false when entries is not array', () => {
      const data = {
        flavor_text_entries: {},
      };

      expect(isValidItemSpecies(data)).toBe(false);
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

      expect(isValidItemSpecies(data)).toBe(false);
    });
  });
});
