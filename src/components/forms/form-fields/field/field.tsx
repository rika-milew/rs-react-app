import classNames from 'classnames/bind';
import type { ReactNode } from 'react';

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
  reverse?: boolean;
};

import styles from './field.module.css';

const cx = classNames.bind(styles);

export function Field({
  id,
  label,
  error,
  children,
  className,
  reverse = false,
}: FieldProps) {
  const labelElement = <label htmlFor={id}>{label}</label>;

  return (
    <div className={cx('field', { error: !!error }, className)}>
      {reverse ? children : labelElement}
      {reverse ? labelElement : children}
      <span className={cx('error-message')}>{error ?? ''}</span>
    </div>
  );
}
