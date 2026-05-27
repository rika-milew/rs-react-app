import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './error-state';

describe('ErrorState component', () => {
  it('displays message text correctly', () => {
    render(<ErrorState message="Something went wrong" onReload={vi.fn()} />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders try again button', () => {
    render(<ErrorState message="Error" onReload={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });

  it('calls onReload funcion when the button is clicked', async () => {
    const user = userEvent.setup();
    const onReload = vi.fn();

    render(<ErrorState message="Error" onReload={onReload} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(onReload).toHaveBeenCalledTimes(1);
  });
});
