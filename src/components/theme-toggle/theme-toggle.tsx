'use client';

import classNames from 'classnames/bind';
import { useTheme } from '@/theme-context/theme-context';
import styles from './theme-toggle.module.css';

const cx = classNames.bind(styles);

import Image from 'next/image';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDefault = theme === 'dark';

  return (
    <button
      type="button"
      className={cx('theme-toggle')}
      onClick={toggleTheme}
      aria-label={`Switch to the ${isDefault ? 'light' : 'dark'} mode`}
      title={`Switch to the ${isDefault ? 'light' : 'dark'} mode`}
      data-theme={theme}
    >
      <div className={cx('icon-container')}>
        <Image
          className={cx('icon', { visible: isDefault })}
          src="/sun.svg"
          alt="Sun"
          width={24}
          height={24}
        />
        <Image
          className={cx('icon', { visible: !isDefault })}
          src="/moon.svg"
          alt="Moon"
          width={24}
          height={24}
        />
      </div>
    </button>
  );
};
