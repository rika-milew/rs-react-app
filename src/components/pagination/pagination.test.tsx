import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Pagination } from './pagination';

describe('pagination component', () => {
  it('renders correct page information', () => {
    render(<Pagination page={0} totalPages={10} onPageChange={vi.fn()} />);

    expect(screen.getByText(/page/i)).toHaveTextContent('Page 1 of 10');
  });

  it('calls onPageChange with next page when next button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={1} totalPages={10} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with previous page when prev button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables Prev button on the first page', () => {
    render(<Pagination page={0} totalPages={10} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('disables Next button on the last page', () => {
    render(<Pagination page={10} totalPages={10} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
