import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import styles from './footer.module.css';

const cx = classNames.bind(styles);

export function Footer() {
  const t = useTranslations('Home');

  return (
    <footer className={cx('footer')}>
      <span className={cx('logo')}>RS School</span>
      <a
        className={cx('github')}
        href="https://github.com/rika-milew"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('name')}
        <span className={cx('visually-hidden')}>{t('newTab')}</span>
      </a>
      <span className={cx('year')}>© {new Date().getFullYear()}</span>
    </footer>
  );
}
