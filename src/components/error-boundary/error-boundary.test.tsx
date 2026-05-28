import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './error-boundary';
import userEvent from '@testing-library/user-event';

const TestError = ({ isError }: { isError: boolean }) => {
  if (isError) {
    throw new Error('Test error');
  }
  return <div>Expected content</div>;
};

describe('ErrorBoundary component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children components when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>App Content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('App Content')).toBeInTheDocument();
  });

  it('displays error message when child component throws an error', () => {
    render(
      <ErrorBoundary>
        <TestError isError={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('Please try again or reset the app.'),
    ).toBeInTheDocument();
  });

  it('renders try again button in error state', () => {
    render(
      <ErrorBoundary>
        <TestError isError={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('initial state has hasError: false', () => {
    render(
      <ErrorBoundary>
        <div>App Content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('App Content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('resets error state after clicking the reset button', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <TestError isError={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    const button = screen.getByRole('button', {
      name: /try again/i,
    });

    await user.click(button);

    expect(
      await screen.findByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
  });
});
