'use client';

import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useLocale } from '@/lib/locale-provider';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/lib/navigation';
import styles from './language-switcher.module.css';

const cx = classNames.bind(styles);

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('lang')) {
      const params = new URLSearchParams(searchParams);
      params.set('lang', locale);
      router.replace('?' + params.toString());
    }
  }, [locale, router, searchParams]);

  const switchLocale = (newLocale: string) => {
    setLocale(newLocale);
    const params = new URLSearchParams(searchParams);
    params.set('lang', newLocale);
    router.replace('?' + params.toString());
  };

  return (
    <div className={cx('language-switcher')}>
      <button
        className={cx('button', { active: locale === 'en' })}
        onClick={() => switchLocale('en')}
        aria-label="English"
      >
        EN
      </button>
      <span className={cx('separator')}>|</span>
      <button
        className={cx('button', { active: locale === 'be' })}
        onClick={() => switchLocale('be')}
        aria-label="Беларуская"
      >
        BE
      </button>
    </div>
  );
}
