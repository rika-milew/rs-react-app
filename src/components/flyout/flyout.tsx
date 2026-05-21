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
    (state: RootState) => state.selectedItems.selectedItems
  );
  const count = selectedItems.length;
  const [isDownloading, setIsDownloading] = useState(false);

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

    try {
      const items = await getItemsById(selectedItems);
      if (items.length > 0) {
        downloadCSV(items);
      }
    } catch (error) {
      console.error('Failed to download CSV:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={cx('flyout')}>
      <span className={cx('count')}>
        Selected Items:
        <span>
          {' '}
          {count} Item{count === 1 ? '' : 's'}
        </span>
      </span>
      <div className={cx('buttons')}>
        <Button variant="gray" onClick={handleClearAll} text="Unselect all" />
        <Button
          variant="basic"
          onClick={() => {
            void handleDownload();
          }}
          text="Download"
        />
      </div>
    </div>
  );
}
