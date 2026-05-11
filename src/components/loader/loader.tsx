import React from 'react';
const cx = classNames.bind(styles);
import styles from './loader.module.css';
import classNames from 'classnames/bind';

type Props = {
  loading?: boolean;
};

export class Loader extends React.Component<Props> {
  public render() {
    if (this.props.loading === false) {
      return null;
    }
    return (
      <div className={cx('loader')}>
        <div className={cx('spinner')} />
        <span className={cx('text')}>Loading…</span>
      </div>
    );
  }
}
