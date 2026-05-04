import React from 'react';
import { Button } from '@/components/button/button';
import classNames from 'classnames/bind';
import styles from './state-view.module.css';

const cx = classNames.bind(styles);

type Props = {
  message: string;
  onReload: () => void;
};

export class StateView extends React.Component<Props> {
  public render() {
    const { message, onReload } = this.props;

    return (
      <div className={cx('state')}>
        <p>{message}</p>
        <Button text="Try again" onClick={onReload} />
      </div>
    );
  }
}
