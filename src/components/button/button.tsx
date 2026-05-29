import classNames from 'classnames/bind';
import styles from './button.module.css';

const cx = classNames.bind(styles);

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'basic' | 'gray' | 'error' | 'pagination';
  className?: string;
};

export function Button({
  text,
  onClick,
  disabled = false,
  variant = 'basic',
  className,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx('button', variant, className, {
        disabled,
      })}
    >
      {text}
    </button>
  );
}
