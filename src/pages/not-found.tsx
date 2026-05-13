import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/button/button';
import styles from './not-found.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={cx('not-found')}>
      <h1 className={cx('heading')}>404</h1>
      <p className={cx('text')}>Page not found</p>
      <Button
        text="Back Home"
        onClick={() => {
          void navigate({ to: '/' });
        }}
        className={cx('height')}
      />
    </div>
  );
}
