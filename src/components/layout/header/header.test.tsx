import { render, screen, waitFor, act } from '@testing-library/react';
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
    expect(screen.getByText('React App')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('has banner role', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('adds sticky class when scrollY is greater than threshold', async () => {
    render(<Header />);

    Object.defineProperty(globalThis, 'scrollY', {
      value: 100,
      writable: true,
    });

    act(() => {
      void globalThis.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      expect(screen.getByRole('banner').className).toMatch(/sticky/);
    });
  });

  it('does not add sticky class when scrollY is smaller than scroll threshold', async () => {
    render(<Header />);

    Object.defineProperty(globalThis, 'scrollY', {
      value: 2,
      writable: true,
    });

    act(() => {
      void globalThis.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      expect(screen.getByRole('banner').className).not.toMatch(/sticky/);
    });
  });
});
