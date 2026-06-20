'use client';

import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/button/button';
import styles from '@/styles/pages/error.module.css';

const cx = classNames.bind(styles);

export default function ErrorPage({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorPage');

  return (
    <div className={cx('error-container')}>
      <h2 className={cx('title')}>{t('title')}</h2>
      <p className={cx('text')}>{t('text')}</p>
      <Button text={t('tryAgain')} onClick={reset} className={cx('height')} />
    </div>
  );
}
