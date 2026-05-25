import classNames from 'classnames/bind';
import { useEffect, useCallback } from 'react';
import { useDataList } from '@/hooks/use-data-list';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { StateView } from '@/components/state-view/state-view';
import { usePagination } from '@/hooks/use-pagination';
import { ERROR_MESSAGES, ROUTES } from '@/constants/constants';
import styles from './card-list.module.css';
import { useNavigate } from '@tanstack/react-router';

const cx = classNames.bind(styles);

type Props = {
  search: string;
};

export function CardList({ search }: Props) {
  const { data, totalPages, status, error, loadData } = useDataList();

  const { page, handlePrevious, handleNext, setPage } =
    usePagination(totalPages);

  const navigate = useNavigate();

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
  }, [search, setPage]);

  useEffect(() => {
    void loadData(search, page);
  }, [search, page, loadData]);

  if (status === 'error') {
    return (
      <StateView
        message={error ?? ERROR_MESSAGES.DEFAULT}
        onReload={() => {
          void loadData(search, page);
        }}
      />
    );
  }

  if (status === 'not-found') {
    return (
      <StateView
        message={ERROR_MESSAGES.NOTFOUND}
        onReload={() => {
          void loadData(search, page);
        }}
      />
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
    </section>
  );
}
