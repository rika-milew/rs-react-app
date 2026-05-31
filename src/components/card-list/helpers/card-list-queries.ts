import { ERROR_MESSAGES, API_STATUS } from '@/constants/constants';
import { useGetListQuery, useSearchQuery } from '@/store/api/api-endpoints';
import type { PokemonWithDescription } from '@/types/api';

type CardState = {
  data: PokemonWithDescription[];
  totalPages: number;
  status: 'loading' | 'error' | 'not-found' | 'success';
  error: string | null;
};

type ListResult =
  | {
      status: string;
      data?: PokemonWithDescription[];
      totalPages?: number;
    }
  | undefined;

export function getCardListState(
  isLoading: boolean,
  isError: boolean,
  isSearch: boolean,
  searchResult: PokemonWithDescription | null | undefined,
  listResult: ListResult,
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

  if (listResult?.status === API_STATUS.SUCCESS) {
    return {
      data: listResult.data ?? [],
      totalPages: listResult.totalPages ?? 0,
      status: 'success',
      error: null,
    };
  }

  return { data: [], totalPages: 0, status: 'not-found', error: null };
}

type CardListQueriesResult = {
  listResult: ListResult;
  searchResult: PokemonWithDescription | null | undefined;
  loading: boolean;
  queryError: boolean;
  isFetching: boolean;
};

export function useCardListQueries(
  isSearch: boolean,
  normalizedSearch: string,
  currentPage: number,
): CardListQueriesResult {
  const listQuery = useGetListQuery(
    { search: '', page: currentPage },
    { skip: isSearch },
  );

  const searchQuery = useSearchQuery(normalizedSearch, { skip: !isSearch });

  const loading = isSearch ? searchQuery.isLoading : listQuery.isLoading;
  const queryError = isSearch ? searchQuery.isError : listQuery.isError;
  const isFetching = isSearch ? searchQuery.isFetching : listQuery.isFetching;

  return {
    listResult: listQuery.data,
    searchResult: searchQuery.data,
    loading,
    queryError,
    isFetching,
  };
}
