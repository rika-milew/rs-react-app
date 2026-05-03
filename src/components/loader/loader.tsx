import React from 'react';
const cx = classNames.bind(styles);
import styles from './loader.module.css';
import classNames from 'classnames/bind';

export class Loader extends React.Component {
  public render() {
    return (
      <div className={cx('loader-container')}>
        <div className={cx('loader')}>
          <div className={cx('spinner')} />
          <span className={cx('text')}>Loading…</span>
        </div>
      </div>
    );
  }
}
