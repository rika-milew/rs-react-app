import classNames from 'classnames/bind';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/constants';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle';
import styles from './header.module.css';

const cx = classNames.bind(styles);

export function Header() {
  const pathname = usePathname();

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
            href={ROUTES.HOME}
            className={cx('link', { active: pathname === '/' })}
          >
            Home
          </Link>
          <Link
            href={ROUTES.ABOUT}
            className={cx('link', { active: pathname === '/about' })}
          >
            About
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
