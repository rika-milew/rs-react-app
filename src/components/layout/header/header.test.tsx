import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Header } from './header';

describe('header component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders header content correctly', () => {
    render(<Header />);

    const header = screen.getByRole('banner');

    expect(header).toBeInTheDocument();
    expect(screen.getByText('RS')).toBeInTheDocument();
    expect(screen.getByText('React Forms')).toBeInTheDocument();
  });

  it('has banner role', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
