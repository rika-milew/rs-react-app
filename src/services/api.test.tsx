import { describe, it, expect } from 'vitest';
import { getItems, getItemByName, getItemSpecies, getItemFull } from './api';
import {
  mockFetchData,
  mockFetchDataError,
  mockItemFull,
} from '@/test-utils/api-mock';
import { HTTP_STATUS, CARD_LIMIT } from '@/constants/constants';
import { ApiError } from '@/services/api-error';

describe('fetchData service', () => {
  it('returns data list correctly', async () => {
    mockFetchData({
      count: 1,
      results: [{ name: 'bulbasaur', url: 'url' }],
      previous: null,
      next: null,
    });

    const result = await getItems(0, CARD_LIMIT);

    expect(result.count).toBe(1);
    expect(result.results).toHaveLength(1);
  });

  it('gets data by item name correctly', async () => {
    mockFetchData(mockItemFull);

    const result = await getItemByName('Bulbasaur');

    expect(result.name).toBe('bulbasaur');
  });

  it('returns item species data correctly', async () => {
    mockFetchData({
      flavor_text_entries: [
        {
          flavor_text: 'A strange seed was planted on its back at birth.',
          language: { name: 'en' },
        },
      ],
    });

    const result = await getItemSpecies('url');

    expect(result.flavor_text_entries).toHaveLength(1);
  });

  it('throws ApiError when data fetch fails', async () => {
    mockFetchDataError(HTTP_STATUS.INTERNAL_SERVER_ERROR);

    await expect(getItems(0, CARD_LIMIT)).rejects.toBeInstanceOf(ApiError);
  });

  it('returns full item data correctly', async () => {
    const mockFetchData = vi.spyOn(globalThis, 'fetch');

    mockFetchData
      .mockResolvedValueOnce(Response.json(mockItemFull))
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

    const result = await getItemFull('bulbasaur');

    expect(result.description).toBe(
      'A strange seed was planted on its back at birth.'
    );
  });
});
