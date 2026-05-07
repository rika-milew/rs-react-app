import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getData } from './data-service';
import { ApiError } from '@/services/api-error';
import { HTTP_STATUS } from '@/constants/constants';

import { getPokemons, getPokemonFull } from '@/services/api';

import type { PokemonListResponse } from '@/types/api';

import { mockPokemonFull, mockPokemonPartial } from '@/test-utils/api-mock';

vi.mock('@/services/api', () => ({
  getPokemons: vi.fn(),
  getPokemonFull: vi.fn(),
}));

const mockedPokemons = vi.mocked(getPokemons);
const mockedPokemonFull = vi.mocked(getPokemonFull);

describe('getData service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns single pokemon correctly', async () => {
    mockedPokemonFull.mockResolvedValue(mockPokemonFull);

    const result = await getData(0, 'bulbasaur');

    expect(result.type).toBe('success');

    if (result.type === 'success') {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('bulbasaur');
    }
  });

  it('returns not found when API responds with 404', async () => {
    mockedPokemonFull.mockRejectedValue(
      new ApiError(HTTP_STATUS.NOT_FOUND, 'not found')
    );

    const result = await getData(0, 'unknownPokemon');

    expect(result.type).toBe('not-found');
  });

  it('returns server error message when API responds with 500', async () => {
    mockedPokemons.mockRejectedValue(
      new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'server error')
    );

    const result = await getData(0, '');

    expect(result.type).toBe('error');

    if (result.type === 'error') {
      expect(result.message).toMatch(/server error/i);
    }
  });

  it('returns network error message when API responds with 0', async () => {
    mockedPokemons.mockRejectedValue(new ApiError(0, 'network error'));

    const result = await getData(0, '');

    expect(result.type).toBe('error');

    if (result.type === 'error') {
      expect(result.message).toMatch(/network error/i);
    }
  });

  it('returns error on unexpected API error', async () => {
    mockedPokemons.mockRejectedValue(new Error('unknown error'));

    const result = await getData(0, '');

    expect(result.type).toBe('error');
  });

  it('returns paginated list when no search query', async () => {
    mockedPokemons.mockResolvedValue({
      count: 2,
      results: [
        { name: mockPokemonFull.name, url: 'url' },
        { name: mockPokemonPartial.name, url: 'url' },
      ],
      next: null,
      previous: null,
    } satisfies PokemonListResponse);

    mockedPokemonFull
      .mockResolvedValueOnce(mockPokemonFull)
      .mockResolvedValueOnce(mockPokemonPartial);

    const result = await getData(0, '');

    expect(result.type).toBe('success');

    if (result.type === 'success') {
      expect(result.data).toHaveLength(2);
    }
  });
});
