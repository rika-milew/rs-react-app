import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useDataList } from '@/hooks/use-data-list';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { ERROR_MESSAGES, ROUTES } from '@/constants/constants';
import { ErrorState } from '@/components/error-state/error-state';
import styles from './card-list.module.css';
import { useNavigate } from '@tanstack/react-router';

const cx = classNames.bind(styles);

type Props = {
  search: string;
  page: number;
  onPageChange: (page: number) => void;
};

export function CardList({ search, page, onPageChange }: Props) {
  const { data, totalPages, status, error, loadData } = useDataList();

  const navigate = useNavigate();

  const openDetailView = (id: number) => {
    void navigate({
      to: ROUTES.DETAIL,
      params: { detailId: String(id) },
    });
  };

  useEffect(() => {
    if (status === 'success' && totalPages > 0 && page > totalPages) {
      onPageChange(totalPages);
    }
  }, [status, totalPages, page, onPageChange]);

  useEffect(() => {
    void loadData(search, page - 1);
  }, [search, page, loadData]);

  if (status === 'error') {
    return (
      <ErrorState
        message={error ?? ERROR_MESSAGES.DEFAULT}
        onReload={() => {
          void loadData(search, page - 1);
        }}
      />
    );
  }

  if (status === 'not-found') {
    return (
      <ErrorState
        message={ERROR_MESSAGES.NOTFOUND}
        onReload={() => {
          void loadData(search, page - 1);
        }}
      />
    );
  }

  const isListLoaded = status === 'success';
  const isLoading = status === 'loading';

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
      {isListLoaded && !isLoading && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
