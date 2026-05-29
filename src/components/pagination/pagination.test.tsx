import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Pagination } from './pagination';
import { useSearch, useNavigate } from '@tanstack/react-router';

vi.mock('@tanstack/react-router', () => ({
  useSearch: vi.fn(),
  useNavigate: vi.fn(),
}));

describe('pagination component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders correct page information', () => {
    vi.mocked(useSearch).mockReturnValue({ page: 1 });

    render(<Pagination totalPages={10} />);

    expect(screen.getByText(/page/i)).toHaveTextContent('Page 1 of 10');
  });

  it('navigates to the next page when next button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(useSearch).mockReturnValue({ page: 1 });
    render(<Pagination totalPages={10} />);

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({
      to: '.',
      search: { page: 2 },
      replace: true,
    });
  });

  it('navigates to the previous page when prev button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(useSearch).mockReturnValue({ page: 2 });
    render(<Pagination totalPages={5} />);

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({
      to: '.',
      search: { page: 1 },
      replace: true,
    });
  });

  it('disables Prev button on the first page', () => {
    vi.mocked(useSearch).mockReturnValue({ page: 1 });
    render(<Pagination totalPages={10} />);

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('disables Next button on the last page', () => {
    vi.mocked(useSearch).mockReturnValue({ page: 10 });
    render(<Pagination totalPages={10} />);

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
