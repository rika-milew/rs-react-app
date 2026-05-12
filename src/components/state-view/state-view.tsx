import { Button } from '@/components/button/button';
import classNames from 'classnames/bind';
import styles from './state-view.module.css';

const cx = classNames.bind(styles);

type Props = {
  message: string;
  onReload: () => void;
};

export const StateView = ({ message, onReload }: Props) => {
  return (
    <div className={cx('state')}>
      <p>{message}</p>
      <Button text="Try again" onClick={onReload} />
    </div>
  );
};
