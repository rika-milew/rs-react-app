'use client';

import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { Button } from '@/components/button/button';
import styles from '@/styles/pages/not-found.module.css';

const cx = classNames.bind(styles);

export default function NotFound() {
  const t = useTranslations('NotFound');
  const router = useRouter();

  return (
    <div className={cx('not-found')}>
      <h1 className={cx('heading')}>404</h1>
      <p className={cx('text')}>{t('title')}</p>
      <Button
        text={t('backHome')}
        onClick={() => router.push('/')}
        className={cx('height')}
      />
    </div>
  );
}
