import classNames from 'classnames/bind';
import styles from './header.module.css';

const cx = classNames.bind(styles);

export function Header() {
  return (
    <header className={cx('header')}>
      <h1 className={cx('logo')}>
        RS <span>React Forms</span>
      </h1>
      <a href="#main-content" className={cx('skip-link')}>
        Skip to the main content
      </a>
    </header>
  );
}
