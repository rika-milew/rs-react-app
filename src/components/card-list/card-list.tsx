import classNames from 'classnames/bind';
import { useCallback, useMemo } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { Button } from '@/components/button/button';
import { ERROR_MESSAGES, ROUTES } from '@/constants/constants';
import { ErrorState } from '@/components/error-state/error-state';
import styles from './card-list.module.css';
import { apiEndpoints } from '@/store/api/api-endpoints';
import {
  getCardListState,
  useCardListQueries,
} from './helpers/card-list-queries';
import { useDispatch } from 'react-redux';

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

  const { listResult, searchResult, loading, queryError, isFetching } =
    useCardListQueries(isSearch, normalizedSearch, currentPage);

  const { data, totalPages, status } = useMemo(
    () =>
      getCardListState(loading, queryError, isSearch, searchResult, listResult),
    [loading, queryError, isSearch, searchResult, listResult],
  );

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

  if (status === 'error' || status === 'not-found') {
    return (
      <ErrorState
        message={
          status === 'error' ? ERROR_MESSAGES.DEFAULT : ERROR_MESSAGES.NOTFOUND
        }
        onReload={refreshData}
      />
    );
  }

  const isListLoaded = status === 'success';
  const showLoader = status === 'loading' || isFetching;

  return (
    <section className={cx('section')}>
      <h2 className={cx('title')}>Results</h2>
      {showLoader && <Loader />}
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
      {isListLoaded && !showLoader && <Pagination totalPages={totalPages} />}
      <Button
        onClick={refreshData}
        text={isFetching ? 'Updating...' : 'Refresh'}
        disabled={isFetching}
        className="refresh-button"
      />
    </section>
  );
}
