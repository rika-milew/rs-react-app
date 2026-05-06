import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorButton } from './error-button';

describe('ErrorButton component', () => {
  it('renders error button', () => {
    render(<ErrorButton />);

    expect(
      screen.getByRole('button', { name: 'Trigger error' })
    ).toBeInTheDocument();
  });

  it('renders button with correct text', () => {
    render(<ErrorButton />);

    expect(screen.getByRole('button')).toHaveTextContent('Trigger error');
  });

  it('throws error after click', () => {
    render(<ErrorButton />);

    expect(() => {
      fireEvent.click(screen.getByRole('button'));
    }).toThrow('Test error triggered');
  });

  it('has error variant class', () => {
    render(<ErrorButton />);

    const button = screen.getByRole('button');
    expect(button.className).toMatch(/error/);
  });
});
