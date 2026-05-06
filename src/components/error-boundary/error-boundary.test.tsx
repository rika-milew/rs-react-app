import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './error-boundary';

const TestError = ({ isError }: { isError: boolean }) => {
  if (isError) {
    throw new Error('Test error');
  }
  return <div>Expected content</div>;
};

const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(vi.fn());

describe('ErrorBoundary component', () => {
  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  it('renders children components when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>App Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('App Content')).toBeInTheDocument();
  });

  it('displays error message when child component throws an error', () => {
    render(
      <ErrorBoundary>
        <TestError isError={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('Please try again or reset the app.')
    ).toBeInTheDocument();
  });

  it('renders try again button in error state', () => {
    render(
      <ErrorBoundary>
        <TestError isError={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('initial state has hasError: false', () => {
    render(
      <ErrorBoundary>
        <div>App Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('App Content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('shows console error when error is caught', () => {
    const consoleTest = vi.spyOn(console, 'error');

    render(
      <ErrorBoundary>
        <TestError isError={true} />
      </ErrorBoundary>
    );

    expect(consoleTest).toHaveBeenCalledWith(
      'Error caught:',
      expect.any(Error),
      expect.any(Object)
    );

    consoleTest.mockRestore();
  });
});
