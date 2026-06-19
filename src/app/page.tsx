'use client';

import classNames from 'classnames/bind';
import { CardList } from '@/components/card-list/card-list';
import { SearchBar } from '@/components/search-bar/search-bar';
import { ErrorButton } from '@/components/error-button/error-button';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_STATUS } from '@/constants/constants';
import { useGetListQuery } from '@/store/api/api-endpoints';
import { DetailView } from '@/components/detail-view/detail-view';
import { getErrorMessage } from '@/utils/error-handlers';
import { useDispatch } from 'react-redux';
import {
  setLoading,
  setFetching,
  setError,
  setTotalPages,
} from '@/store/ui-state-slice';
import type { PokemonWithDescription } from '@/types/api';
import { Loader } from '@/components/loader/loader';
import styles from '../styles/pages/search-page.module.css';

const cx = classNames.bind(styles);

function HomePageContent() {
  const [searchData, setSearchData] = useState<PokemonWithDescription[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const detailId = searchParams.get('detail');
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

  const isInitialLoading = !listData && !isError && !isSearchActive;

  useEffect(() => {
    if (!searchParams.get('page')) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      router.replace('/?' + params.toString());
    }
  }, []);

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
      const params = new URLSearchParams(searchParams);
      params.set('detail', String(id));
      router.push('/?' + params.toString());
    },
    [router, searchParams],
  );

  const closeDetailView = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('detail');
    router.replace('/?' + params.toString());
  }, [router, searchParams]);

  const data = isSearchActive
    ? searchData
    : listData?.status === API_STATUS.SUCCESS
      ? listData.data
      : [];

  return (
    <div className={cx('home-page-layout')}>
      <div className={cx('search-section', { split: !!detailId })}>
        <SearchBar onSearchResult={handleSearchResult} />
        <CardList
          data={data}
          onRefresh={handleRefresh}
          onCardClick={openDetailView}
          isInitialLoading={isInitialLoading}
        />
        <ErrorButton />
      </div>
      {detailId && (
        <div className={cx('detail-section', 'open')}>
          <DetailView detailId={detailId} onClose={closeDetailView} />
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <HomePageContent />
    </Suspense>
  );
}
