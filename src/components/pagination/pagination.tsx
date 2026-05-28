import classNames from 'classnames/bind';
import styles from './pagination.module.css';

const cx = classNames.bind(styles);

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  const validPage = Math.min(Math.max(1, page), totalPages || 1);

  const handlePreviousPage = () => {
    if (validPage > 1) {
      onPageChange(validPage - 1);
    }
  };

  const handleNextPage = () => {
    if (validPage < totalPages) {
      onPageChange(validPage + 1);
    }
  };

  return (
    <div className={cx('pagination')}>
      <button
        type="button"
        className={cx('pagination-button')}
        disabled={validPage === 1}
        onClick={handlePreviousPage}
      >
        ← Prev
      </button>
      <span className={cx('page-info')}>
        Page <span className={cx('page-number')}>{validPage}</span> of{' '}
        {totalPages}
      </span>
      <button
        type="button"
        className={cx('pagination-button')}
        disabled={validPage >= totalPages}
        onClick={handleNextPage}
      >
        Next →
      </button>
    </div>
  );
};
