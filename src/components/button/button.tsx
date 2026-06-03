import classNames from 'classnames/bind';
import styles from './button.module.css';

const cx = classNames.bind(styles);

type ButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  className?: string;
};

export function Button({
  text,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
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
