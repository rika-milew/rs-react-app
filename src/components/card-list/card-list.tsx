import classNames from 'classnames/bind';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useDataList } from '@/hooks/use-data-list';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { ERROR_MESSAGES, ROUTES } from '@/constants/constants';
import { ErrorState } from '@/components/error-state/error-state';
import styles from './card-list.module.css';

const cx = classNames.bind(styles);

type CardListProps = {
  search: string;
};

export function CardList({ search }: CardListProps) {
  const { data, totalPages, status, error, loadData } = useDataList();
  const searchParams = useSearch({ from: ROUTES.LAYOUT });
  const { page = 1 } = searchParams;
  const navigate = useNavigate();

  const openDetailView = (id: number) => {
    void navigate({
      to: ROUTES.DETAIL,
      params: { detailId: String(id) },
      search: searchParams,
    });
  };

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
