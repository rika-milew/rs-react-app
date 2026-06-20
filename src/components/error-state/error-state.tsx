'use client';

import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/button/button';
import styles from './error-state.module.css';

const cx = classNames.bind(styles);

type ErrorStateProps = {
  message: string;
  onReload: () => void;
};

export const ErrorState = ({ message, onReload }: ErrorStateProps) => {
  const t = useTranslations('Home');

  return (
    <div className={cx('state')}>
      <p>{message}</p>
      <Button text={t('tryAgain')} onClick={onReload} />
    </div>
  );
};
