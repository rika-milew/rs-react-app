import { useState } from 'react';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { clearAllItems } from '@/store/slice';
import { Button } from '@/components/button/button';
import { downloadCSV } from '@/utils/download-csv';
import { getItemsById } from '@/services/api';
import styles from './flyout.module.css';

const cx = classNames.bind(styles);

export function Flyout() {
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.selectedItems.selectedItems,
  );
  const count = selectedItems.length;
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (count === 0) {
    return null;
  }

  const handleClearAll = () => {
    dispatch(clearAllItems());
  };

  const handleDownload = async () => {
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      const items = await getItemsById(selectedItems);
      if (items.length > 0) {
        downloadCSV(items);
      }
    } catch (error) {
      setError('Failed to download. Please try again.');
      console.error('Failed to download CSV:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={cx('flyout')}>
      <span className={cx('count')} aria-live="polite">
        Selected Items:
        <span>
          {' '}
          {count} Item{count === 1 ? '' : 's'}
        </span>
      </span>
      {error && (
        <p className={cx('download-error')} role="alert">
          {error}
        </p>
      )}
      <div className={cx('buttons')}>
        <Button
          variant="primary"
          onClick={handleClearAll}
          text="Unselect all"
        />
        <Button
          variant="basic"
          onClick={() => {
            void handleDownload();
          }}
          disabled={isDownloading}
          aria-busy={isDownloading}
          text={isDownloading ? 'Downloading...' : 'Download'}
        />
      </div>
    </div>
  );
}
