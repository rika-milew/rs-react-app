import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './footer';

describe('footer component', () => {
  it('renders footer content', () => {
    render(<Footer />);

    expect(screen.getByText('RS School')).toBeInTheDocument();
    expect(screen.getByText('Eryka Mileuskaya')).toBeInTheDocument();
  });

  it('displays correct GitHub link', () => {
    render(<Footer />);

    const link = screen.getByRole('link', {
      name: /Eryka Mileuskaya/,
    });

    expect(link).toHaveAttribute('href', 'https://github.com/rika-milew');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows current year', () => {
    render(<Footer />);

    const year = new Date().getFullYear();

    expect(screen.getByText(`© ${String(year)}`)).toBeInTheDocument();
  });

  it('renders footer with contentinfo role', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
