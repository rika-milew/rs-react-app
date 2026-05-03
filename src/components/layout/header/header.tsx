import React from 'react';
import classNames from 'classnames/bind';
import styles from './header.module.css';

const cx = classNames.bind(styles);

const SCROLL = 5;

type Props = Record<string, never>;

type State = {
  isSticky: boolean;
};

export class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isSticky: false,
    };
  }

  public handleScroll = () => {
    this.setState({
      isSticky: window.scrollY > SCROLL,
    });
  };

  public componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  public componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  public render() {
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
