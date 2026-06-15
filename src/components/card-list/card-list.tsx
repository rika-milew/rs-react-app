import classNames from 'classnames/bind';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { Pagination } from '@/components/pagination/pagination';
import { Button } from '@/components/button/button';
import { ERROR_MESSAGES } from '@/constants/constants';
import type { PokemonWithDescription } from '@/types/api';
import { ErrorState } from '@/components/error-state/error-state';
import { getErrorMessage } from '@/utils/error-handlers';

import styles from './card-list.module.css';

const cx = classNames.bind(styles);

type CardListProps = {
  data: PokemonWithDescription[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: unknown;
  totalPages: number;
  onRefresh: () => void;
  onCardClick: (id: number) => void;
};

export function CardList({
  data,
  isLoading,
  isError,
  isFetching,
  error,
  totalPages,
  onRefresh,
  onCardClick,
}: CardListProps) {
  if (isLoading) {
    return (
      <section className={cx('section')}>
        <h2 className={cx('title')}>Results</h2>
        <Loader />
      </section>
    );
  }

  if (isError) {
    return <ErrorState message={getErrorMessage(error)} onReload={onRefresh} />;
  }

  if (data.length === 0 && !isFetching) {
    return (
      <ErrorState message={ERROR_MESSAGES.NOTFOUND} onReload={onRefresh} />
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
              onCardClick(card.id);
            }}
          />
        ))}
      </div>
      {!isFetching && <Pagination totalPages={totalPages} />}
      <Button
        onClick={onRefresh}
        text={isFetching ? 'Updating...' : 'Refresh'}
        disabled={isFetching}
        className="refresh-button"
      />
    </section>
  );
}
