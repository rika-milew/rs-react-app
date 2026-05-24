import classNames from 'classnames/bind';
import { Link } from '@tanstack/react-router';
import { ROUTES } from '@/constants/constants';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle';
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
      <div className={cx('menu')}>
        <nav className={cx('nav')}>
          <Link
            to={ROUTES.HOME}
            className={cx('link')}
            activeProps={{ className: cx('active') }}
          >
            Home
          </Link>
          <Link
            to={ROUTES.ABOUT}
            className={cx('link')}
            activeProps={{ className: cx('active') }}
          >
            About
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
