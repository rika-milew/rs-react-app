import { HTTP_STATUS } from '@/constants/constants';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function isNotFoundError(
  error: FetchBaseQueryError | SerializedError | undefined,
): boolean {
  if (!error || !('status' in error)) {
    return false;
  }
  return error.status === HTTP_STATUS.NOT_FOUND;
}
