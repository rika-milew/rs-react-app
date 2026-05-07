import { describe, it, expect } from 'vitest';
import {
  getPokemons,
  getPokemonByName,
  getPokemonSpecies,
  getPokemonFull,
} from './api';

import { mockFetchData, mockFetchDataError } from '@/test-utils/api-mock';

import { HTTP_STATUS, CARD_LIMIT } from '@/constants/constants';

import { ApiError } from '@/services/api-error';

describe('fetchData service', () => {
  it('returns data list correctly', async () => {
    mockFetchData({
      count: 1,
      results: [{ name: 'bulbasaur', url: 'url' }],
    });

    const result = await getPokemons(0, CARD_LIMIT);

    expect(result.count).toBe(1);
    expect(result.results).toHaveLength(1);
  });

  it('gets data by pokemon name correctly', async () => {
    mockFetchData({
      id: 1,
      name: 'bulbasaur',
      sprites: {},
      species: { url: 'url' },
    });

    const result = await getPokemonByName('Bulbasaur');

    expect(result.name).toBe('bulbasaur');
  });

  it('returns pokemon species data correctly', async () => {
    mockFetchData({
      flavor_text_entries: [
        {
          flavor_text: 'A strange seed was planted on its back at birth.',
          language: { name: 'en' },
        },
      ],
    });

    const result = await getPokemonSpecies('url');

    expect(result.flavor_text_entries).toHaveLength(1);
  });

  it('throws ApiError when data fetch fails', async () => {
    mockFetchDataError(HTTP_STATUS.INTERNAL_SERVER_ERROR);

    await expect(getPokemons(0, CARD_LIMIT)).rejects.toBeInstanceOf(ApiError);
  });

  it('returns full pokemon data correctly', async () => {
    const mockFetchData = vi.spyOn(globalThis, 'fetch');

    mockFetchData
      .mockResolvedValueOnce(
        Response.json({
          id: 1,
          name: 'bulbasaur',
          sprites: {
            front_default: 'image',
          },
          species: {
            url: 'url',
          },
        })
      )
      .mockResolvedValueOnce(
        Response.json({
          flavor_text_entries: [
            {
              flavor_text: 'A strange seed was planted on its back at birth.',
              language: { name: 'en' },
            },
          ],
        })
      );

    const result = await getPokemonFull('bulbasaur');

    expect(result.description).toBe(
      'A strange seed was planted on its back at birth.'
    );
  });
});
