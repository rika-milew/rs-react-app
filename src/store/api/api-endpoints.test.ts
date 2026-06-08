import { describe, it, expect } from 'vitest';
import {
  handleErrorResult,
  handleQueryError,
  handleSearchError,
  useGetListQuery,
  useSearchQuery,
  useGetDetailQuery,
  useDownloadMutation,
} from './api-endpoints';
import { ApiError } from '@/services/api-error';
import { API_STATUS, HTTP_STATUS, ERROR_MESSAGES } from '@/constants/constants';

describe('apiEndpoints exports', () => {
  it('should export useGetListQuery', () => {
    expect(useGetListQuery).toBeDefined();
    expect(typeof useGetListQuery).toBe('function');
  });

  it('should export useSearchQuery', () => {
    expect(useSearchQuery).toBeDefined();
    expect(typeof useSearchQuery).toBe('function');
  });

  it('should export useGetDetailQuery', () => {
    expect(useGetDetailQuery).toBeDefined();
    expect(typeof useGetDetailQuery).toBe('function');
  });

  it('should export useDownloadMutation', () => {
    expect(useDownloadMutation).toBeDefined();
    expect(typeof useDownloadMutation).toBe('function');
  });
});

describe('handleErrorResult', () => {
  it('returns a server error with a message if the status is error and there is a message', () => {
    const result = handleErrorResult({
      status: API_STATUS.ERROR,
      message: 'Database error',
    });
    expect(result).toEqual({
      error: {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: 'Database error',
      },
    });
  });

  it('returns a server error with a default message if the status is error without a message', () => {
    const result = handleErrorResult({ status: API_STATUS.ERROR });
    expect(result).toEqual({
      error: {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: ERROR_MESSAGES.SERVER,
      },
    });
  });

  it('returns a server error with the default message for other statuses', () => {
    const result = handleErrorResult({ status: 'Unknown' });
    expect(result).toEqual({
      error: {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: ERROR_MESSAGES.SERVER,
      },
    });
  });
});

describe('handleQueryError', () => {
  it('handles ApiError and returns its status and message', () => {
    const error = new ApiError(HTTP_STATUS.BAD_REQUEST, 'Bad request');
    expect(handleQueryError(error)).toEqual({
      error: { status: HTTP_STATUS.BAD_REQUEST, data: 'Bad request' },
    });
  });

  it('handles an unknown error and returns 500 with a default message', () => {
    expect(handleQueryError(new Error('unknown error'))).toEqual({
      error: {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: ERROR_MESSAGES.DEFAULT,
      },
    });
  });
});

describe('handleSearchError', () => {
  it('returns { data: null } for 404 error', () => {
    const error = new ApiError(HTTP_STATUS.NOT_FOUND, 'Not found');
    expect(handleSearchError(error)).toEqual({ data: null });
  });

  it('returns server error for 500 error', () => {
    const error = new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
    expect(handleSearchError(error)).toEqual({
      error: {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: ERROR_MESSAGES.SERVER,
      },
    });
  });

  it('returns 500 with default message for unknown error', () => {
    expect(handleSearchError('unknown')).toEqual({
      error: {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: ERROR_MESSAGES.DEFAULT,
      },
    });
  });
});
