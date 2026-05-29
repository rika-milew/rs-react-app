import { useEffect } from 'react';
import { Button } from '@/components/button/button';
import { useSearch, useNavigate } from '@tanstack/react-router';
import classNames from 'classnames/bind';
import styles from './pagination.module.css';

const cx = classNames.bind(styles);

type PaginationProps = {
  totalPages: number;
};

export const Pagination = ({ totalPages }: PaginationProps) => {
  const navigate = useNavigate();
  const { page = 1 } = useSearch({ from: '/_layout' });

  const validPage = Math.max(1, Math.min(page, totalPages || 1));

  useEffect(() => {
    if (totalPages > 0 && (page < 1 || page > totalPages)) {
      const validPage = Math.max(1, Math.min(page, totalPages));
      void navigate({
        to: '.',
        search: { page: validPage },
        replace: true,
      });
    }
  }, [page, totalPages, navigate]);

  const handlePageChange = (newPage: number) => {
    const validNewPage = Math.max(1, Math.min(newPage, totalPages));
    void navigate({
      to: '.',
      search: { page: validNewPage },
      replace: true,
    });
  };

  const handlePreviousPage = () => {
    if (validPage > 1) {
      handlePageChange(validPage - 1);
    }
  };

  const handleNextPage = () => {
    if (validPage < totalPages) {
      handlePageChange(validPage + 1);
    }
  };

  return (
    <div className={cx('pagination')}>
      <Button
        text="← Prev"
        onClick={handlePreviousPage}
        disabled={validPage === 1}
        variant="secondary"
      />
      <span className={cx('page-info')}>
        Page <span className={cx('page-number')}>{validPage}</span> of{' '}
        {totalPages}
      </span>
      <Button
        text="Next →"
        onClick={handleNextPage}
        disabled={validPage >= totalPages}
        variant="secondary"
      />
    </div>
  );
};
