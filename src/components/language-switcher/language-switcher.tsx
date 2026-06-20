'use client';

import classNames from 'classnames/bind';
import { useLocale } from '@/contexts/locale-provider';
import styles from './language-switcher.module.css';

const cx = classNames.bind(styles);

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className={cx('language-switcher')}>
      <button
        className={cx('button', { active: locale === 'en' })}
        onClick={() => setLocale('en')}
      >
        EN
      </button>
      <span className={cx('separator')}>|</span>
      <button
        className={cx('button', { active: locale === 'be' })}
        onClick={() => setLocale('be')}
      >
        BE
      </button>
    </div>
  );
}
