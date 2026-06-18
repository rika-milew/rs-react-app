'use client';

import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/button';
import styles from '../styles/pages/not-found.module.css';

const cx = classNames.bind(styles);

export default function NotFound() {
  const router = useRouter();

  return (
    <div className={cx('not-found')}>
      <h1 className={cx('heading')}>404</h1>
      <p className={cx('text')}>Page not found</p>
      <Button
        text="Back Home"
        onClick={() => router.push('/')}
        className={cx('height')}
      />
    </div>
  );
}
