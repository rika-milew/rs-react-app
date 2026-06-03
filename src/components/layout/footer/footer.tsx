import classNames from 'classnames/bind';
import styles from './footer.module.css';

const cx = classNames.bind(styles);

export function Footer() {
  return (
    <footer className={cx('footer')}>
      <span className={cx('logo')}>RS School</span>
      <a
        className={cx('github')}
        href="https://github.com/rika-milew"
        target="_blank"
        rel="noopener noreferrer"
      >
        Eryka Mileuskaya
        <span className={cx('visually-hidden')}> (Opens in new tab)</span>
      </a>
      <span className={cx('year')}>© {new Date().getFullYear()}</span>
    </footer>
  );
}
