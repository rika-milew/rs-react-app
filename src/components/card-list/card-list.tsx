import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useDataList } from '@/hooks/use-data-list';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { StateView } from '@/components/state-view/state-view';
import { usePagination } from '@/hooks/use-pagination';
import { useDetailNavigation } from '@/hooks/use-detail-navigation';
import { ERROR_MESSAGES } from '@/constants/constants';
import styles from './card-list.module.css';

const cx = classNames.bind(styles);

type Props = {
  search: string;
};

export function CardList({ search }: Props) {
  const { data, totalPages, status, error, loadData } = useDataList();

  const { page, handlePrevious, handleNext, setPage } =
    usePagination(totalPages);

  const { openDetailView } = useDetailNavigation();

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
