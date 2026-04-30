import React from 'react';
import classNames from 'classnames/bind';
import styles from './header.module.css';

const cx = classNames.bind(styles);

type Props = Record<string, never>;

interface State {
  isSticky: boolean;
}

export class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isSticky: false,
    };
  }

  handleScroll = () => {
    this.setState({
      isSticky: window.scrollY > 5,
    });
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    return (
      <header
        className={cx('header', {
          sticky: this.state.isSticky,
        })}
      >
        <h1 className={cx('logo')}>
          RS <span>React App</span>
        </h1>
        <p className={cx('text')}>React Class Components</p>
      </header>
    );
  }
}
