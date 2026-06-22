'use client';

import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/navigation';
import { ROUTES } from '@/constants/constants';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle';
import LanguageSwitcher from '@/components/language-switcher/language-switcher';
import styles from './header.module.css';

const cx = classNames.bind(styles);

export function Header() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  return (
    <header className={cx('header')}>
      <h1 className={cx('logo')}>
        RS <span>React App</span>
      </h1>
      <a href="#main-content" className={cx('skip-link')}>
        {t('skipToContent')}
      </a>
      <div className={cx('menu')}>
        <nav className={cx('nav')}>
          <Link
            href={ROUTES.HOME}
            className={cx('link', { active: pathname === '/' })}
          >
            {t('home')}
          </Link>
          <Link
            href={ROUTES.ABOUT}
            className={cx('link', { active: pathname === '/about' })}
          >
            {t('about')}
          </Link>
        </nav>
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
