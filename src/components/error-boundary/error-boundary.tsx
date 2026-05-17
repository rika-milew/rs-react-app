import classNames from 'classnames/bind';
import { Component, type ReactNode } from 'react';
import type { ErrorInfo } from 'react';
import { Button } from '@/components/button/button';
import { Layout } from '@/components/layout/layout';
import styles from './error-boundary.module.css';

const cx = classNames.bind(styles);

type ErrorBoundaryProps = {
  children?: ReactNode;
  layout?: boolean;
  error?: Error;
  reset?: () => void;
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
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error caught:', error, errorInfo);
    }
  }

  private resetError = () => {
    this.setState({ hasError: false });
    if (this.props.reset) {
      this.props.reset();
    }
  };

  public render() {
    const isError = this.state.hasError || !!this.props.error;

    if (isError) {
      const errorBoundary = (
        <div className={cx('error-container')}>
          <h2 className={cx('title')}>Something went wrong</h2>
          <p className={cx('text')}>Please try again or reset the app.</p>
          <Button
            text="Try again"
            onClick={this.resetError}
            className={cx('height')}
          />
        </div>
      );

      if (this.props.layout === false) {
        return errorBoundary;
      }

      return <Layout>{errorBoundary}</Layout>;
    }

    return this.props.children;
  }
}
