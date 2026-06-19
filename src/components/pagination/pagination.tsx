'use client';

import { useEffect } from 'react';
import { Button } from '@/components/button/button';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './pagination.module.css';

const cx = classNames.bind(styles);

type PaginationProps = {
  totalPages: number;
};

export const Pagination = ({ totalPages }: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;

  const validPage = Math.max(1, Math.min(page, totalPages || 1));

  useEffect(() => {
    if (totalPages > 0 && (page < 1 || page > totalPages)) {
      const validPage = Math.max(1, Math.min(page, totalPages));
      const params = new URLSearchParams(searchParams);
      params.set('page', String(validPage));
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [page, totalPages, router, searchParams, pathname]);

  const handlePageChange = (newPage: number) => {
    const validNewPage = Math.max(1, Math.min(newPage, totalPages));
    const params = new URLSearchParams(searchParams);
    params.set('page', String(validNewPage));
    router.replace(`${pathname}?${params.toString()}`);
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
    <div className={cx('pagination')} data-pagination>
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
