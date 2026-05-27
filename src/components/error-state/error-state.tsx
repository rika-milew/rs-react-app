import classNames from 'classnames/bind';
import { Button } from '@/components/button/button';
import styles from './state-view.module.css';

const cx = classNames.bind(styles);

type Props = {
  message: string;
  onReload: () => void;
};

export const ErrorState = ({ message, onReload }: Props) => {
  return (
    <div className={cx('state')}>
      <p>{message}</p>
      <Button text="Try again" onClick={onReload} />
    </div>
  );
};
