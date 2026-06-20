'use client';

import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import styles from '../../styles/pages/about-page.module.css';

const cx = classNames.bind(styles);

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <div className={cx('about')}>
      <h1>{t('title')}</h1>

      <p className={cx('text')}>{t('author')}</p>
      <p className={cx('text')}>
        Github:{' '}
        <a
          className={cx('link')}
          href="https://github.com/rika-milew"
          target="_blank"
          rel="noopener noreferrer"
        >
          rika-milew
          <span className={cx('visually-hidden')}>{t('newTab')}</span>
        </a>
      </p>

      <p className={cx('text')}>
        {t('startDescription')}{' '}
        <a
          className={cx('link')}
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('link')}
          <span className={cx('visually-hidden')}>{t('newTab')}</span>
        </a>{' '}
        {t('endDescription')}
      </p>
    </div>
  );
}
