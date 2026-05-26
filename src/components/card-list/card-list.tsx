import classNames from 'classnames/bind';
import { useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { StateView } from '@/components/state-view/state-view';
import { Button } from '@/components/button/button';
import { usePagination } from '@/hooks/use-pagination';
import { ERROR_MESSAGES } from '@/constants/constants';
import styles from './card-list.module.css';
import { useNavigate } from '@tanstack/react-router';
import { useGetListQuery, useSearchQuery } from '@/store/api/api-endpoints';
import {
  getCardListState,
  getCurrentPage,
  getDetailParams,
} from './helpers/card-list-state';
import type { PokemonWithDescription } from '@/types/api';

const cx = classNames.bind(styles);

const normalize = (value: string): string => value.trim().toLowerCase();

type Props = {
  search: string;
};

export function CardList({ search }: Props) {
  const navigate = useNavigate();

  const normalizedSearch = normalize(search);
  const isSearch = !!normalizedSearch;

  const { page, setPage, setTotalPages, handlePrevious, handleNext } =
    usePagination(0);

  const {
    data: listResult,
    isLoading: listLoading,
    isFetching: listFetching,
    isError: listError,
    refetch: refetchList,
  } = useGetListQuery({ search: '', page }, { skip: isSearch });

  const {
    data: searchResult,
    isLoading: searchLoading,
    isFetching: searchFetching,
    isError: searchError,
    refetch: refetchSearch,
  } = useSearchQuery(normalizedSearch, { skip: !isSearch });

  const { data, totalPages, status, error } = useMemo(
    () =>
      getCardListState(
        isSearch ? searchLoading : listLoading,
        isSearch ? searchError : listError,
        isSearch,
        searchResult,
        listResult
      ),
    [
      searchLoading,
      listLoading,
      searchError,
      listError,
      isSearch,
      searchResult,
      listResult,
    ]
  );

  const refreshData = useCallback(() => {
    if (search) {
      void refetchSearch();
    } else {
      void refetchList();
    }
  }, [search, refetchSearch, refetchList]);

  const openDetailView = useCallback(
    (id: number) => void navigate(getDetailParams(id, getCurrentPage())),
    [navigate]
  );

  useEffect(() => {
    setPage(0);
  }, [normalizedSearch, setPage]);

  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages, setTotalPages]);

  const stateMessages = {
    error: error ?? ERROR_MESSAGES.DEFAULT,
    'not-found': ERROR_MESSAGES.NOTFOUND,
  };

  if (status === 'error' || status === 'not-found') {
    return <StateView message={stateMessages[status]} onReload={refreshData} />;
  }

  const isListLoaded = status === 'success';

  return (
    <CardListView
      data={data}
      status={isListLoaded ? 'success' : 'loading'}
      page={page}
      totalPages={totalPages}
      onPrev={handlePrevious}
      onNext={handleNext}
      onCardClick={openDetailView}
      onRefresh={refreshData}
      isRefreshing={isSearch ? searchFetching : listFetching}
    />
  );
}

type CardListViewProps = {
  data: PokemonWithDescription[];
  status: 'loading' | 'success';
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onCardClick: (id: number) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

export function CardListView({
  data,
  status,
  page,
  totalPages,
  onPrev,
  onNext,
  onCardClick,
  onRefresh,
  isRefreshing,
}: CardListViewProps) {
  return (
    <section className={cx('section')}>
      <h2 className={cx('title')}>Results</h2>
      {status === 'loading' && <Loader />}
      <div className={cx('card-container')}>
        {data.map((card) => (
          <Card
            key={card.id}
            item={card}
            variant="short"
            onClick={() => {
              onCardClick(card.id);
            }}
          />
        ))}
      </div>
      {status === 'success' && (
        <Pagination
          page={page}
          totalPages={totalPages}
          loading={false}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
      <Button
        onClick={onRefresh}
        text={isRefreshing ? 'Updating...' : 'Refresh'}
        disabled={isRefreshing}
        className="refresh-button"
      />
    </section>
  );
}
