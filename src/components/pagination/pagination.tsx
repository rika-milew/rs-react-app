import React from 'react';
import classNames from 'classnames/bind';
import styles from './pagination.module.css';

const cx = classNames.bind(styles);

type Props = {
  page: number;
  totalPages: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export class Pagination extends React.Component<Props> {
  public render() {
    const { page, totalPages, loading, onPrev, onNext } = this.props;

    return (
      <div className={cx('pagination')}>
        <button
          className={cx('pagination-button')}
          disabled={page === 0 || loading}
          onClick={onPrev}
        >
          ← Prev
        </button>
        <span className={cx('page-info')}>
          Page <span className={cx('page-number')}>{page + 1}</span> of{' '}
          {totalPages}
        </span>
        <button
          className={cx('pagination-button')}
          disabled={page + 1 >= totalPages || loading}
          onClick={onNext}
        >
          Next →
        </button>
      </div>
    );
  }
}
