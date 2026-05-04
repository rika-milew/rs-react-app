import { Component, type ReactNode } from 'react';
import type { ErrorInfo } from 'react';
import { Button } from '@/components/button/button';
import classNames from 'classnames/bind';
import { Layout } from '@/components/layout/layout';

import styles from './error-boundary.module.css';

const cx = classNames.bind(styles);

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  private resetError = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <div className={cx('error-container')}>
            <h2 className={cx('title')}>Something went wrong</h2>
            <p className={cx('text')}>Please try again or reset the app.</p>
            <div className={cx('button-container')}>
              <Button text="Try again" onClick={this.resetError} />
            </div>
          </div>
        </Layout>
      );
    }

    return this.props.children;
  }
}
