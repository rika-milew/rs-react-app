'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/button/button';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/lib/navigation';
import classNames from 'classnames/bind';
import styles from './pagination.module.css';

const cx = classNames.bind(styles);

type PaginationProps = {
  totalPages: number;
};

export const Pagination = ({ totalPages }: PaginationProps) => {
  const t = useTranslations('Pagination');
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
        text={t('prev')}
        onClick={handlePreviousPage}
        disabled={validPage === 1}
        variant="secondary"
      />
      <span className={cx('page-info')}>
        {t('page')} <span className={cx('page-number')}>{validPage}</span>
        {t('of')} {totalPages}
      </span>
      <Button
        text={t('next')}
        onClick={handleNextPage}
        disabled={validPage >= totalPages}
        variant="secondary"
      />
    </div>
  );
};
