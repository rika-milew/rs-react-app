import classNames from 'classnames/bind';
import type { FormFields } from '@/types/form-types';
import styles from './card.module.css';

const cx = classNames.bind(styles);

type CardProps = {
  data: FormFields;
  isRecent?: boolean;
};

export function Card({ data, isRecent }: CardProps) {
  return (
    <div className={cx('card', { recent: isRecent })}>
      <div className={cx('header')}>
        <h3 className={cx('name')}>{data.name}</h3>
        <span className={cx('date')}>
          {new Date(data.createdAt).toLocaleString()}
        </span>
      </div>
      <div className={cx('content')}>
        <p>
          <strong>Age</strong>
          <span className={cx('accent')}>{data.age}</span>
        </p>
        <p>
          <strong>Gender</strong>
          <span className={cx('accent')}>{data.gender}</span>
        </p>
        <p>
          <strong>Email</strong>
          <span className={cx('accent')}>{data.email}</span>
        </p>
        <p>
          <strong>Terms accepted</strong>
          <span className={data.terms ? cx('terms-yes') : cx('terms-no')}>
            {data.terms ? 'Yes' : 'No'}
          </span>
        </p>
      </div>
    </div>
  );
}
