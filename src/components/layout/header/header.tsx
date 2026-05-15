import { Link } from '@tanstack/react-router';

import classNames from 'classnames/bind';
import styles from './header.module.css';

const cx = classNames.bind(styles);

export function Header() {
  return (
    <header className={cx('header')}>
      <h1 className={cx('logo')}>
        RS <span>React App</span>
      </h1>
      <a href="#main-content" className={cx('skip-link')}>
        Skip to the main content
      </a>
      <nav className={cx('nav')}>
        <Link
          to="/"
          className={cx('link')}
          activeProps={{ className: cx('active') }}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={cx('link')}
          activeProps={{ className: cx('active') }}
        >
          About
        </Link>
      </nav>
    </header>
  );
}
