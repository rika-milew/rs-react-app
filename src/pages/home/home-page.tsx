import classNames from 'classnames/bind';
import styles from './home-page.module.css';

const cx = classNames.bind(styles);

export const HomePage = () => {
  return (
    <div className={cx('home-page')}>
      <h1>React Forms</h1>
    </div>
  );
};
