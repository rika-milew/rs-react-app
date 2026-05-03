import React from 'react';
import styles from './footer.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class Footer extends React.Component {
  public render() {
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
        </a>
        <span className={cx('year')}>© {new Date().getFullYear()}</span>
      </footer>
    );
  }
}
