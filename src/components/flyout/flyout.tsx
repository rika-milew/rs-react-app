import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { clearAllItems } from '@/store/slice';
import { Button } from '@/components/button/button';
import styles from './flyout.module.css';

const cx = classNames.bind(styles);

export function Flyout() {
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.selectedItems.selectedItems
  );
  const count = selectedItems.length;

  if (count === 0) {
    return null;
  }

  const handleClearAll = () => {
    dispatch(clearAllItems());
  };

  const handleDownload = () => {
    // TODO: add function
    console.log('Download selected items:', selectedItems);
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
          variant="gray"
          onClick={handleClearAll}
          text="Unselect all"
        ></Button>
        <Button
          variant="basic"
          onClick={handleDownload}
          text="Download"
        ></Button>
      </div>
    </div>
  );
}
