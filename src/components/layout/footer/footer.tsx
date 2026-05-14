import styles from './footer.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export function Footer() {
  return (
    <footer className={cx('footer')}>
      <span className={cx('logo')}>RS School</span>
      <a
        className={cx('github')}
        href="https://github.com/rika-milew"
        target="_blank"
        rel="noreferrer"
      >
        Eryka Mileuskaya
        <span className="visually-hidden"> (Opens in new tab)</span>
      </a>
      <span className={cx('year')}>© {new Date().getFullYear()}</span>
    </footer>
  );
}
