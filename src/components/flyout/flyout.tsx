import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { clearAllItems } from '@/store/slice';
import { Button } from '@/components/button/button';
import { downloadCSV } from '@/utils/download-csv';
import { useDownloadMutation } from '@/store/api/api-endpoints';
import styles from './flyout.module.css';

const cx = classNames.bind(styles);

export function Flyout() {
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.selectedItems.selectedItems,
  );
  const count = selectedItems.length;
  const [downloadItems, { isLoading }] = useDownloadMutation();

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
      .catch((error: unknown) => {
        console.error('Failed to download CSV:', error);
      });
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
        <Button
          variant="primary"
          onClick={handleClearAll}
          text="Unselect all"
          disabled={isLoading}
        />
        <Button
          variant="basic"
          onClick={handleDownload}
          text={isLoading ? 'Downloading...' : 'Download'}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
