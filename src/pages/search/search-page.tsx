import { CardList } from '@/components/card-list/card-list';
import { SearchBar } from '@/components/search-bar/search-bar';
import { ErrorButton } from '@/components/error-button/error-button';
import { useCallback, useEffect, useState } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { ROUTES, API_STATUS } from '@/constants/constants';
import { useGetListQuery } from '@/store/api/api-endpoints';
import { getErrorMessage } from '@/utils/error-handlers';
import { useDispatch } from 'react-redux';
import {
  setLoading,
  setFetching,
  setError,
  setTotalPages,
  resetError,
} from '@/store/ui-state-slice';
import type { PokemonWithDescription } from '@/types/api';
import { useLocalStorage } from '@/hooks/use-local-storage';

export const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useLocalStorage('search', '');
  const [searchData, setSearchData] = useState<PokemonWithDescription[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(() => !!searchQuery);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const searchParams = useSearch({ from: ROUTES.LAYOUT });
  const { page = 1 } = searchParams;
  const currentPage = page - 1;

  const {
    data: listData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: refetchList,
  } = useGetListQuery(
    { search: '', page: currentPage },
    { skip: isSearchActive },
  );

  useEffect(() => {
    if (isSearchActive) {
      return;
    }

    dispatch(setLoading(isLoading));
    dispatch(setFetching(isFetching));

    if (isError) {
      dispatch(setError(getErrorMessage(error)));
      return;
    }

    if (listData) {
      if (listData.status === API_STATUS.SUCCESS) {
        dispatch(setTotalPages(listData.totalPages));
      } else {
        dispatch(setTotalPages(0));
      }
    }
  }, [
    listData,
    isLoading,
    isFetching,
    isError,
    error,
    isSearchActive,
    dispatch,
  ]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setIsSearchActive(!!query);

      if (!query) {
        dispatch(resetError());
      }

      void navigate({
        to: '.',
        search: { page: 1 },
        replace: true,
      });
    },
    [setSearchQuery, dispatch, navigate],
  );

  const handleSearchDataChange = useCallback(
    (data: PokemonWithDescription[]) => {
      setSearchData(data);
    },
    [],
  );

  const handleRefresh = useCallback(() => {
    if (isSearchActive) {
      handleSearch('');
    } else {
      void refetchList();
    }
  }, [isSearchActive, handleSearch, refetchList]);

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

  const data = isSearchActive
    ? searchData
    : listData?.status === API_STATUS.SUCCESS
      ? listData.data
      : [];

  return (
    <>
      <SearchBar
        key={searchQuery}
        value={searchQuery}
        onSearch={handleSearch}
        onDataChange={handleSearchDataChange}
      />
      <CardList
        data={data}
        onRefresh={handleRefresh}
        onCardClick={openDetailView}
      />
      <ErrorButton />
    </>
  );
};
