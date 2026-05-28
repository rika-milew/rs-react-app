import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotFoundPage } from './not-found';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/constants/constants';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

describe('NotFoundPage', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders heading, message and button', () => {
    render(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Back Home' }),
    ).toBeInTheDocument();
  });

  it('navigates to home page when button is clicked', () => {
    render(<NotFoundPage />);

    const button = screen.getByRole('button', { name: 'Back Home' });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ to: ROUTES.HOME });
  });
});
