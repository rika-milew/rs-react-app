'use client';

import { CardList } from '@/components/card-list/card-list';
import { SearchBar } from '@/components/search-bar/search-bar';
import { ErrorButton } from '@/components/error-button/error-button';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_STATUS } from '@/constants/constants';
import { useGetListQuery } from '@/store/api/api-endpoints';
import { getErrorMessage } from '@/utils/error-handlers';
import { useDispatch } from 'react-redux';
import {
  setLoading,
  setFetching,
  setError,
  setTotalPages,
} from '@/store/ui-state-slice';
import type { PokemonWithDescription } from '@/types/api';

export default function HomePage() {
  const [searchData, setSearchData] = useState<PokemonWithDescription[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const dispatch = useDispatch();

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
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

  const handleSearchResult = useCallback(
    (isActive: boolean, data: PokemonWithDescription[]) => {
      setIsSearchActive(isActive);
      setSearchData(data);

      if (isActive) {
        const params = new URLSearchParams();
        params.set('page', '1');
        router.replace(`/?${params.toString()}`);
      }
    },
    [router],
  );

  const handleRefresh = useCallback(() => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchData([]);
    } else {
      void refetchList();
    }
  }, [isSearchActive, refetchList]);

  const openDetailView = useCallback(
    (id: number) => {
      router.push('/details/' + String(id));
    },
    [router],
  );

  const data = isSearchActive
    ? searchData
    : listData?.status === API_STATUS.SUCCESS
      ? listData.data
      : [];

  return (
    <>
      <SearchBar onSearchResult={handleSearchResult} />
      <CardList
        data={data}
        onRefresh={handleRefresh}
        onCardClick={openDetailView}
      />
      <ErrorButton />
    </>
  );
}
