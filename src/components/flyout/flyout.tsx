'use client';

import classNames from 'classnames/bind';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { clearAllItems } from '@/store/slice';
import { Button } from '@/components/button/button';
import { downloadCSV } from '@/utils/download-csv';
import { generateCSV } from '@/app/actions';
import styles from './flyout.module.css';

const cx = classNames.bind(styles);

export function Flyout() {
  const t = useTranslations('Flyout');
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.selectedItems.selectedItems,
  );
  const count = selectedItems.length;
  const [isLoading, setIsLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  if (count === 0) {
    return null;
  }

  const handleClearAll = () => {
    dispatch(clearAllItems());
  };

  const handleDownload = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setDownloadError(false);
    try {
      const { csv, fileName } = await generateCSV(selectedItems);
      downloadCSV(csv, fileName);
    } catch {
      setDownloadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cx('flyout')}>
      <span className={cx('count')} aria-live="polite">
        {t('selectedItems')}
        <span>
          {' '}
          {count} {count === 1 ? t('item') : t('items')}
        </span>
      </span>
      {downloadError && (
        <p className={cx('download-error')} role="alert">
          {t('downloadError')}
        </p>
      )}
      <div className={cx('buttons')}>
        <Button
          variant="primary"
          onClick={handleClearAll}
          text={t('unselectAll')}
          disabled={isLoading}
        />
        <Button
          variant="basic"
          onClick={() => {
            void handleDownload();
          }}
          text={isLoading ? t('downloading') : t('download')}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
