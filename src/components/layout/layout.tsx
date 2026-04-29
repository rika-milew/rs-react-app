import React from 'react';
import styles from './layout.module.css';
import { Header } from './header/header';

import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface Props {
  children: React.ReactNode;
}

export class Layout extends React.Component<Props> {
  render() {
    return (
      <div className={cx('wrapper')}>
        <Header />

        <main className={cx('main')}>{this.props.children}</main>
      </div>
    );
  }
}
