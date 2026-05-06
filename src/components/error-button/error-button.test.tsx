import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorButton } from './error-button';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '@/components/error-boundary/error-boundary';
import { waitFor } from '@testing-library/react';

describe('ErrorButton component', () => {
  it('renders error button', () => {
    render(<ErrorButton />);
    expect(
      screen.getByRole('button', { name: 'Trigger error' })
    ).toBeInTheDocument();
  });

  it('triggers error boundary when clicked', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('has error variant class', () => {
    render(<ErrorButton />);

    const button = screen.getByRole('button');
    expect(button.className).toMatch(/error/);
  });
});
