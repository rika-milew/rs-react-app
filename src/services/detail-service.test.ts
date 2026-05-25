import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDetailData } from './detail-service';
import { getItemFull } from '@/services/api';
import { ApiError } from '@/services/api-error';
import { API_STATUS, HTTP_STATUS, ERROR_MESSAGES } from '@/constants/constants';
import { mockItemFull } from '@/test-utils/api-mock';

vi.mock('@/services/api', () => ({
  getItemFull: vi.fn(),
}));

describe('getDetailData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success status with data when API fetches data successfully', async () => {
    vi.mocked(getItemFull).mockResolvedValue(mockItemFull);

    const result = await getDetailData('1');

    expect(result).toEqual({
      type: API_STATUS.SUCCESS,
      data: mockItemFull,
    });
    expect(getItemFull).toHaveBeenCalledWith('1');
  });

  it('returns not found status when API returns 404', async () => {
    vi.mocked(getItemFull).mockRejectedValue(
      new ApiError(HTTP_STATUS.NOT_FOUND, 'Not Found')
    );

    const result = await getDetailData('1000');

    expect(result).toEqual({ type: API_STATUS.NOT_FOUND });
  });

  it('returns error status with server message when API returns 500', async () => {
    vi.mocked(getItemFull).mockRejectedValue(
      new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Server Error')
    );

    const result = await getDetailData('1');

    expect(result).toEqual({
      type: API_STATUS.ERROR,
      message: ERROR_MESSAGES.SERVER,
    });
  });

  it('returns error status with network message for network error', async () => {
    vi.mocked(getItemFull).mockRejectedValue(
      new ApiError(HTTP_STATUS.NETWORK_ERROR, 'Network Error')
    );

    const result = await getDetailData('1');

    expect(result).toEqual({
      type: API_STATUS.ERROR,
      message: ERROR_MESSAGES.NETWORK,
    });
  });

  it('returns  error status with default message for unknown error', async () => {
    vi.mocked(getItemFull).mockRejectedValue(new Error('Unknown error'));

    const result = await getDetailData('1');

    expect(result).toEqual({
      type: API_STATUS.ERROR,
      message: ERROR_MESSAGES.DEFAULT,
    });
  });
});
