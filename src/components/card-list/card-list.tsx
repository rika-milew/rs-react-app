import classNames from 'classnames/bind';
import { useCallback, useMemo } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { Button } from '@/components/button/button';
import { ERROR_MESSAGES, ROUTES } from '@/constants/constants';
import { ErrorState } from '@/components/error-state/error-state';
import { useGetListQuery, useSearchQuery } from '@/store/api/api-endpoints';
import { apiEndpoints } from '@/store/api/api-endpoints';
import type { PokemonWithDescription } from '@/types/api';
import {
  isNotFoundError,
  isSuccessListPayload,
} from './helpers/card-list-helpers';
import { useDispatch } from 'react-redux';
import styles from './card-list.module.css';

const cx = classNames.bind(styles);

type CardListProps = {
  search: string;
};

const normalize = (value: string): string => value.trim().toLowerCase();

export function CardList({ search }: CardListProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchParams = useSearch({ from: ROUTES.LAYOUT });
  const { page = 1 } = searchParams;

  const normalizedSearch = normalize(search);
  const isSearch = !!normalizedSearch;

  const currentPage = page - 1;

  const listQuery = useGetListQuery(
    { search: '', page: currentPage },
    { skip: isSearch },
  );

  const searchQuery = useSearchQuery(normalizedSearch, { skip: !isSearch });

  const isLoading = isSearch ? searchQuery.isLoading : listQuery.isLoading;
  const isError = isSearch ? searchQuery.isError : listQuery.isError;
  const isFetching = isSearch ? searchQuery.isFetching : listQuery.isFetching;

  const listData = listQuery.data;

  const data: PokemonWithDescription[] = useMemo(() => {
    if (isSearch) {
      if (
        searchQuery.data &&
        typeof searchQuery.data === 'object' &&
        'name' in searchQuery.data
      ) {
        return [searchQuery.data];
      }
      return [];
    }
    if (isSuccessListPayload(listData)) {
      return listData.data;
    }
    return [];
  }, [isSearch, searchQuery.data, listData]);

  const totalPages: number = useMemo(() => {
    if (isSearch) {
      return 1;
    }
    if (isSuccessListPayload(listData)) {
      return listData.totalPages;
    }
    return 0;
  }, [isSearch, listData]);

  const refreshData = useCallback(() => {
    if (search) {
      dispatch(apiEndpoints.util.invalidateTags(['Search']));
    } else {
      dispatch(apiEndpoints.util.invalidateTags(['List']));
    }
  }, [search, dispatch]);

  const openDetailView = (id: number) => {
    void navigate({
      to: ROUTES.DETAIL,
      params: { detailId: String(id) },
      search: searchParams,
    });
  };

  if (isLoading) {
    return (
      <section className={cx('section')}>
        <h2 className={cx('title')}>Results</h2>
        <Loader />
      </section>
    );
  }

  if (isError) {
    const activeQuery = isSearch ? searchQuery : listQuery;

    return (
      <ErrorState
        message={
          isNotFoundError(activeQuery.error)
            ? ERROR_MESSAGES.NOTFOUND
            : ERROR_MESSAGES.DEFAULT
        }
        onReload={refreshData}
      />
    );
  }

  if (data.length === 0) {
    return (
      <ErrorState message={ERROR_MESSAGES.NOTFOUND} onReload={refreshData} />
    );
  }

  return (
    <section className={cx('section')}>
      <h2 className={cx('title')}>Results</h2>
      {isFetching && <Loader />}
      <div className={cx('card-container')}>
        {data.map((card) => (
          <Card
            key={card.id}
            item={card}
            variant="short"
            onClick={() => {
              openDetailView(card.id);
            }}
          />
        ))}
      </div>
      {!isFetching && <Pagination totalPages={totalPages} />}
      <Button
        onClick={refreshData}
        text={isFetching ? 'Updating...' : 'Refresh'}
        disabled={isFetching}
        className="refresh-button"
      />
    </section>
  );
}
