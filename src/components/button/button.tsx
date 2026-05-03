import React from 'react';
import styles from './button.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'basic' | 'error';
};

export class Button extends React.Component<Props> {
  public static defaultProps = {
    disabled: false,
    variant: 'basic',
  };

  public render() {
    const { text, onClick, disabled, variant } = this.props;

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cx('button', variant, {
          disabled: disabled,
        })}
      >
        {text}
      </button>
    );
  }
}
