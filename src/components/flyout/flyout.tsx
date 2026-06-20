'use client';

import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { clearAllItems } from '@/store/slice';
import { Button } from '@/components/button/button';
import { downloadCSV } from '@/utils/download-csv';
import { useDownloadMutation } from '@/store/api/api-endpoints';
import styles from './flyout.module.css';

const cx = classNames.bind(styles);

export function Flyout() {
  const t = useTranslations('Flyout');
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.selectedItems.selectedItems,
  );
  const count = selectedItems.length;
  const [downloadItems, { isLoading, error }] = useDownloadMutation();

  if (count === 0) {
    return null;
  }

  const handleClearAll = () => {
    dispatch(clearAllItems());
  };

  const handleDownload = () => {
    if (isLoading) {
      return;
    }

    void downloadItems(selectedItems)
      .unwrap()
      .then((items) => {
        if (items.length > 0) {
          downloadCSV(items);
        }
      })
      .catch(() => {
        console.error('Failed to download CSV:', error);
      });
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
      {error && (
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
          onClick={handleDownload}
          text={isLoading ? t('downloading') : t('download')}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
