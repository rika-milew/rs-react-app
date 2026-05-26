import { ERROR_MESSAGES, API_STATUS, ROUTES } from '@/constants/constants';
import type { PokemonWithDescription } from '@/types/api';

type CardState = {
  data: PokemonWithDescription[];
  totalPages: number;
  status: 'loading' | 'error' | 'not-found' | 'success';
  error: string | null;
};

type ListResult =
  | {
      type: string;
      data?: PokemonWithDescription[];
      totalPages?: number;
    }
  | undefined;

export function getCardListState(
  isLoading: boolean,
  isError: boolean,
  isSearch: boolean,
  searchResult: PokemonWithDescription | null | undefined,
  listResult: ListResult
): CardState {
  if (isLoading) {
    return { data: [], totalPages: 0, status: 'loading', error: null };
  }
  if (isError) {
    return {
      data: [],
      totalPages: 0,
      status: 'error',
      error: ERROR_MESSAGES.DEFAULT,
    };
  }

  if (isSearch) {
    return searchResult
      ? { data: [searchResult], totalPages: 1, status: 'success', error: null }
      : { data: [], totalPages: 0, status: 'not-found', error: null };
  }

  if (listResult?.type === API_STATUS.SUCCESS) {
    return {
      data: listResult.data ?? [],
      totalPages: listResult.totalPages ?? 0,
      status: 'success',
      error: null,
    };
  }

  return { data: [], totalPages: 0, status: 'not-found', error: null };
}

export const getCurrentPage = (): number =>
  Number(new URLSearchParams(globalThis.location.search).get('page')) || 1;

export const getDetailParams = (
  id: number,
  page: number
): { to: string; params: { detailId: string }; search: { page: number } } => ({
  to: ROUTES.DETAIL,
  params: { detailId: String(id) },
  search: { page },
});
