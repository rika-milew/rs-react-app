import { API_STATUS, ERROR_MESSAGES, HTTP_STATUS } from '@/constants/constants';
import { isFetchBaseQueryError, isSerializedError } from '@/types/type-guards';

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
