import classNames from 'classnames/bind';
import { useSearch } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { ERROR_MESSAGES, ROUTES } from '@/constants/constants';
import { ErrorState } from '@/components/error-state/error-state';
import styles from './card-list.module.css';
import { useNavigate } from '@tanstack/react-router';
import { useGetListQuery, useSearchQuery } from '@/store/api/api-endpoints';
import { getCardListState } from './helpers/card-list-state';

const cx = classNames.bind(styles);

type CardListProps = {
  search: string;
};

const normalize = (value: string): string => value.trim().toLowerCase();

export function CardList({ search }: CardListProps) {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/_layout' });
  const { page = 1 } = searchParams;

  const normalizedSearch = normalize(search);
  const isSearch = !!normalizedSearch;

  const currentPage = page - 1;

  const {
    data: listResult,
    isLoading: listLoading,
    isError: listError,
    refetch: refetchList,
  } = useGetListQuery({ search: '', page: currentPage }, { skip: isSearch });

  const {
    data: searchResult,
    isLoading: searchLoading,
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
        listResult,
      ),
    [
      searchLoading,
      listLoading,
      searchError,
      listError,
      isSearch,
      searchResult,
      listResult,
    ],
  );

  const refreshData = useCallback(() => {
    if (search) {
      void refetchSearch();
    } else {
      void refetchList();
    }
  }, [search, refetchSearch, refetchList]);

  const openDetailView = (id: number) => {
    void navigate({
      to: ROUTES.DETAIL,
      params: { detailId: String(id) },
      search: searchParams,
    });
  };

  const stateMessages = {
    error: error ?? ERROR_MESSAGES.DEFAULT,
    'not-found': ERROR_MESSAGES.NOTFOUND,
  };

  if (status === 'error' || status === 'not-found') {
    return (
      <ErrorState message={stateMessages[status]} onReload={refreshData} />
    );
  }

  const isListLoaded = status === 'success';
  const isLoading = status === 'loading';

  return (
    <section className={cx('section')}>
      <h2 className={cx('title')}>Results</h2>
      {isLoading && <Loader />}
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
      {isListLoaded && !isLoading && <Pagination totalPages={totalPages} />}
    </section>
  );
}
