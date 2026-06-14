import { API_STATUS, ERROR_MESSAGES, HTTP_STATUS } from '@/constants/constants';
import { isFetchBaseQueryError, isSerializedError } from '@/types/type-guards';
import { ApiError } from '@/services/api-error';

export function getErrorMessage(error: unknown, status?: string): string {
  if (status === API_STATUS.NOT_FOUND) {
    return ERROR_MESSAGES.NOTFOUND;
  }

  if (!error) {
    return ERROR_MESSAGES.DEFAULT;
  }

  if (isFetchBaseQueryError(error)) {
    if (error.status === HTTP_STATUS.NOT_FOUND) {
      return ERROR_MESSAGES.NOTFOUND;
    }
    return ERROR_MESSAGES.DEFAULT;
  }

  if (isSerializedError(error)) {
    return ERROR_MESSAGES.DEFAULT;
  }

  return ERROR_MESSAGES.DEFAULT;
}

type SearchResult =
  | { data: null }
  | { error: { status: number; data: string } };

type ErrorResult = { error: { status: number; data: string } };

export const handleErrorResult = (result: {
  status: string;
  message?: string;
}): ErrorResult => {
  const errorMessage =
    result.status === API_STATUS.ERROR && result.message
      ? result.message
      : ERROR_MESSAGES.SERVER;

  return {
    error: {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: errorMessage,
    },
  };
};

export const handleQueryError = (error: unknown): ErrorResult => {
  if (error instanceof ApiError) {
    return { error: { status: error.status, data: error.message } };
  }
  return {
    error: {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: ERROR_MESSAGES.DEFAULT,
    },
  };
};

export const handleSearchError = (error: unknown): SearchResult => {
  if (error instanceof ApiError) {
    if (error.status === HTTP_STATUS.NOT_FOUND) {
      return { data: null };
    }
    if (error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      return { error: { status: error.status, data: ERROR_MESSAGES.SERVER } };
    }
    return { error: { status: error.status, data: error.message } };
  }
  return {
    error: {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: ERROR_MESSAGES.DEFAULT,
    },
  };
};
