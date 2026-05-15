import { useEffect } from 'react';
import { useDataList } from '@/hooks/use-data-list';
import classNames from 'classnames/bind';
import styles from './card-list.module.css';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { StateView } from '@/components/state-view/state-view';
import { usePagination } from '@/hooks/use-pagination';

const cx = classNames.bind(styles);

type Props = {
  search: string;
};

export function CardList({ search }: Props) {
  const { data, totalPages, status, error, loadData } = useDataList();

  const { page, handlePrevious, handleNext, setPage } =
    usePagination(totalPages);

  useEffect(() => {
    setPage(0);
  }, [search, setPage]);

  useEffect(() => {
    void loadData(search, page);
  }, [search, page, loadData]);

  if (status === 'error') {
    return (
      <StateView
        message={error ?? 'Something went wrong'}
        onReload={() => {
          void loadData(search, page);
        }}
      />
    );
  }

  if (status === 'not-found') {
    return (
      <StateView
        message="Pokemon not found"
        onReload={() => {
          void loadData(search, page);
        }}
      />
    );
  }

  return (
    <section className={cx('section')}>
      <h2 className={cx('title')}>Results</h2>
      {status === 'loading' && (
        <div className={cx('loader-container')}>
          <Loader />
        </div>
      )}
      <div className={cx('card-container')}>
        {data.map((pokemon) => (
          <Card key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
      {!search && (
        <Pagination
          page={page}
          totalPages={totalPages}
          loading={status === 'loading'}
          onPrev={handlePrevious}
          onNext={handleNext}
        />
      )}
    </section>
  );
}
