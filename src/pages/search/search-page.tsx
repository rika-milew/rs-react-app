import { CardList } from '@/components/card-list/card-list';
import { SearchBar } from '@/components/search-bar/search-bar';
import { ErrorButton } from '@/components/error-button/error-button';
import { useCallback, useMemo } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { ROUTES, API_STATUS } from '@/constants/constants';
import { useGetListQuery, useSearchQuery } from '@/store/api/api-endpoints';
import type { PokemonWithDescription } from '@/types/api';
import { useLocalStorage } from '@/hooks/use-local-storage';

const normalize = (value: string): string => value.trim().toLowerCase();

export const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useLocalStorage('search', '');

  const navigate = useNavigate();
  const searchParams = useSearch({ from: ROUTES.LAYOUT });
  const { page = 1 } = searchParams;

  const normalizedSearch = normalize(searchQuery);
  const isSearch = !!normalizedSearch;
  const currentPage = page - 1;

  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
    isFetching: isListFetching,
    error: listError,
    refetch: refetchList,
  } = useGetListQuery({ search: '', page: currentPage }, { skip: isSearch });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    isFetching: isSearchFetching,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchQuery(normalizedSearch, { skip: !isSearch });

  const isLoading = isSearch ? isSearchLoading : isListLoading;
  const isError = isSearch ? isSearchError : isListError;
  const isFetching = isSearch ? isSearchFetching : isListFetching;
  const error = isSearch ? searchError : listError;

  const data: PokemonWithDescription[] = useMemo(() => {
    if (isSearch) {
      return searchData ? [searchData] : [];
    }
    return listData?.status === API_STATUS.SUCCESS ? listData.data : [];
  }, [isSearch, searchData, listData]);

  const totalPages: number = useMemo(() => {
    if (isSearch) {
      return 1;
    }
    return listData?.status === API_STATUS.SUCCESS ? listData.totalPages : 0;
  }, [isSearch, listData]);

  const refreshData = useCallback(() => {
    if (isSearch) {
      void refetchSearch();
    } else {
      void refetchList();
    }
  }, [isSearch, refetchSearch, refetchList]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    void navigate({
      to: '.',
      search: { page: 1 },
      replace: true,
    });
  };

  const openDetailView = useCallback(
    (id: number) => {
      void navigate({
        to: ROUTES.DETAIL,
        params: { detailId: String(id) },
        search: searchParams,
      });
    },
    [navigate, searchParams],
  );

  return (
    <>
      <SearchBar
        key={searchQuery}
        value={searchQuery}
        onSearch={handleSearch}
      />
      <CardList
        data={data}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        error={error}
        totalPages={totalPages}
        onRefresh={refreshData}
        onCardClick={openDetailView}
      />
      <ErrorButton />
    </>
  );
};
