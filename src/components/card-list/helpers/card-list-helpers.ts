import { API_STATUS, HTTP_STATUS } from '@/constants/constants';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { PokemonWithDescription } from '@/types/api';

export function isNotFoundError(
  error: FetchBaseQueryError | SerializedError | undefined,
): boolean {
  if (!error || !('status' in error)) {
    return false;
  }
  return error.status === HTTP_STATUS.NOT_FOUND;
}

type SuccessListPayload = {
  status: string;
  data: PokemonWithDescription[];
  totalPages: number;
};

export function isSuccessListPayload(
  value: unknown,
): value is SuccessListPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    value.status === API_STATUS.SUCCESS &&
    'data' in value &&
    Array.isArray(value.data) &&
    'totalPages' in value &&
    typeof value.totalPages === 'number'
  );
}
