import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutPage } from './about-page';

describe('AboutPage', () => {
  it('shows heading', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
  });

  it('shows author name', () => {
    render(<AboutPage />);

    expect(screen.getByText(/Eryka Mileuskaya/)).toBeInTheDocument();
  });

  it('shows GitHub link with correct attributes', () => {
    render(<AboutPage />);

    const githubLink = screen.getByRole('link', { name: /rika-milew/i });

    expect(githubLink).toHaveAttribute('href', 'https://github.com/rika-milew');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows RS School link with correct attributes', () => {
    render(<AboutPage />);

    const link = screen.getByRole('link', {
      name: /RS School React Course/i,
    });

    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows correct text for accessibility', () => {
    render(<AboutPage />);

    const text = screen.getAllByText(/Opens in new tab/i);

    expect(text).toHaveLength(2);
  });

  it('shows description', () => {
    render(<AboutPage />);

    expect(
      screen.getByText(/demonstrating routing, pagination/i),
    ).toBeInTheDocument();
  });
});
