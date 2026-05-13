import styles from './button.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'basic' | 'error';
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
