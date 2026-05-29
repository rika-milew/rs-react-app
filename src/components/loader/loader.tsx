import classNames from 'classnames/bind';
import styles from './loader.module.css';

const cx = classNames.bind(styles);

type LoaderProps = {
  loading?: boolean;
};

export function Loader({ loading = true }: LoaderProps) {
  if (!loading) {
    return null;
  }

  return (
    <div className={cx('loader-container')}>
      <div className={cx('loader')}>
        <div className={cx('spinner')} />
        <span className={cx('text')}>Loading…</span>
      </div>
    </div>
  );
}
