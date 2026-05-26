import classNames from 'classnames/bind';
import { useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { StateView } from '@/components/state-view/state-view';
import { Button } from '@/components/button/button';
import { usePagination } from '@/hooks/use-pagination';
import { ERROR_MESSAGES, ROUTES } from '@/constants/constants';
import styles from './card-list.module.css';
import { useNavigate } from '@tanstack/react-router';
import { useGetListQuery, useSearchQuery } from '@/store/api/api-endpoints';
import { getCardListState } from './helpers/card-list-state';

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
    isError: listError,
    refetch: refetchList,
  } = useGetListQuery({ search: '', page }, { skip: isSearch });

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
    (id: number): void => {
      const parameters = new URLSearchParams(globalThis.location.search);
      const currentPage = Number(parameters.get('page')) || 1;

      void navigate({
        to: ROUTES.DETAIL,
        params: { detailId: String(id) },
        search: { page: currentPage },
      });
    },
    [navigate]
  );

  useEffect(() => {
    setPage(0);
  }, [normalizedSearch, setPage]);

  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages, setTotalPages]);

  if (status === 'error') {
    return (
      <StateView
        message={error ?? ERROR_MESSAGES.DEFAULT}
        onReload={refreshData}
      />
    );
  }

  if (status === 'not-found') {
    return (
      <StateView message={ERROR_MESSAGES.NOTFOUND} onReload={refreshData} />
    );
  }

  const isListLoaded = status === 'success';

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
              openDetailView(card.id);
            }}
          />
        ))}
      </div>
      {isListLoaded && (
        <Pagination
          page={page}
          totalPages={totalPages}
          loading={false}
          onPrev={handlePrevious}
          onNext={handleNext}
        />
      )}
      <Button
        onClick={refreshData}
        text="Refresh"
        className="refresh-button"
      ></Button>
    </section>
  );
}
