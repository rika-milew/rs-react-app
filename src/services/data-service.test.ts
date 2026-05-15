import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getData } from './data-service';
import { ApiError } from '@/services/api-error';
import { HTTP_STATUS } from '@/constants/constants';

import { getItems, getItemFull } from '@/services/api';

import type { PokemonListResponse } from '@/types/api';

import { mockItemFull, mockItemPartial } from '@/test-utils/api-mock';

vi.mock('@/services/api', () => ({
  getItems: vi.fn(),
  getItemFull: vi.fn(),
}));

const mockedItems = vi.mocked(getItems);
const mockedItemFull = vi.mocked(getItemFull);

describe('getData service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns single item correctly', async () => {
    mockedItemFull.mockResolvedValue(mockItemFull);

    const result = await getData(0, 'bulbasaur');

    expect(result.type).toBe('success');

    if (result.type === 'success') {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('bulbasaur');
    }
  });

  it('returns not found when API responds with 404', async () => {
    mockedItemFull.mockRejectedValue(
      new ApiError(HTTP_STATUS.NOT_FOUND, 'not found')
    );

    const result = await getData(0, 'unknownItem');

    expect(result.type).toBe('not-found');
  });

  it('returns server error message when API responds with 500', async () => {
    mockedItems.mockRejectedValue(
      new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'server error')
    );

    const result = await getData(0, '');

    expect(result.type).toBe('error');

    if (result.type === 'error') {
      expect(result.message).toMatch(/server error/i);
    }
  });

  it('returns network error message when API responds with 0', async () => {
    mockedItems.mockRejectedValue(new ApiError(0, 'network error'));

    const result = await getData(0, '');

    expect(result.type).toBe('error');

    if (result.type === 'error') {
      expect(result.message).toMatch(/network error/i);
    }
  });

  it('returns error on unexpected API error', async () => {
    mockedItems.mockRejectedValue(new Error('unknown error'));

    const result = await getData(0, '');

    expect(result.type).toBe('error');
  });

  it('returns paginated list when no search query', async () => {
    mockedItems.mockResolvedValue({
      count: 2,
      results: [
        { name: mockItemFull.name, url: 'url' },
        { name: mockItemPartial.name, url: 'url' },
      ],
      next: null,
      previous: null,
    } satisfies PokemonListResponse);

    mockedItemFull
      .mockResolvedValueOnce(mockItemFull)
      .mockResolvedValueOnce(mockItemPartial);

    const result = await getData(0, '');

    expect(result.type).toBe('success');

    if (result.type === 'success') {
      expect(result.data).toHaveLength(2);
    }
  });
});
