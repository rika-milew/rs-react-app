'use client';

import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/theme-context/theme-context';
import styles from './theme-toggle.module.css';

const cx = classNames.bind(styles);

import Image from 'next/image';

export const ThemeToggle = () => {
  const t = useTranslations('Theme');

  const { theme, toggleTheme } = useTheme();
  const isDefault = theme === 'dark';

  return (
    <button
      type="button"
      className={cx('theme-toggle')}
      onClick={toggleTheme}
      aria-label={isDefault ? t('switchToLight') : t('switchToDark')}
      title={isDefault ? t('switchToLight') : t('switchToDark')}
      data-theme={theme}
    >
      <div className={cx('icon-container')}>
        <Image
          className={cx('icon', { visible: isDefault })}
          src="/icons/sun.svg"
          alt="Sun"
          width={24}
          height={24}
        />
        <Image
          className={cx('icon', { visible: !isDefault })}
          src="/icons/moon.svg"
          alt="Moon"
          width={24}
          height={24}
        />
      </div>
    </button>
  );
};
