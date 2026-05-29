import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDetailData } from './use-detail-data';
import { API_STATUS } from '@/constants/constants';
import { getItemFull } from '@/services/api';
import { mockItemFull } from '@/test-utils/api-mock';

vi.mock('@/services/api', () => ({
  getItemFull: vi.fn(),
}));

describe('useDetailData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success status if data fetch is successful', async () => {
    vi.mocked(getItemFull).mockResolvedValue(mockItemFull);

    const { result } = renderHook(() => useDetailData('1'));
    expect(result.current).toEqual({ status: API_STATUS.LOADING });

    await waitFor(() => {
      expect(result.current).toEqual({
        status: API_STATUS.SUCCESS,
        data: mockItemFull,
      });
    });
  });

  it('returns null when item id is null', () => {
    const { result } = renderHook(() => useDetailData(null));
    expect(result.current).toBeNull();
  });

  it('returns error message if error occures', async () => {
    vi.mocked(getItemFull).mockRejectedValue(new Error('Error message'));

    const { result } = renderHook(() => useDetailData('1'));

    await waitFor(() => {
      expect(result.current).toEqual({
        status: API_STATUS.ERROR,
        message: 'Error message',
      });
    });
  });

  it('make refetch when item id changes', async () => {
    vi.mocked(getItemFull)
      .mockResolvedValueOnce(mockItemFull)
      .mockResolvedValueOnce({ ...mockItemFull, id: 2 });

    const { result, rerender } = renderHook(({ id }) => useDetailData(id), {
      initialProps: { id: '1' },
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        status: API_STATUS.SUCCESS,
        data: mockItemFull,
      });
    });

    rerender({ id: '2' });

    expect(result.current).toEqual({ status: API_STATUS.LOADING });

    await waitFor(() => {
      expect(result.current).toEqual({
        status: API_STATUS.SUCCESS,
        data: { ...mockItemFull, id: 2 },
      });
    });

    expect(getItemFull).toHaveBeenCalledTimes(2);
  });
});
