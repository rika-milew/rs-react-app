import React from 'react';
import styles from './button.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface Props {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export class Button extends React.Component<Props> {
  static defaultProps = {
    disabled: false,
  };

  render() {
    const { text, onClick, disabled } = this.props;

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cx('button', {
          disabled: disabled,
        })}
      >
        {text}
      </button>
    );
  }
}
