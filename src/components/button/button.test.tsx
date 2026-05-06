import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

describe('button component', () => {
  it('renders text inside button', () => {
    render(<Button text="Try again" onClick={vi.fn()} />);

    expect(screen.getByRole('button')).toHaveTextContent('Try again');
  });

  it('calls onClick after click', () => {
    const handleClick = vi.fn();

    render(<Button text="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('click is ignored when disabled', () => {
    const handleClick = vi.fn();

    render(<Button text="Click" onClick={handleClick} disabled />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('has style variant class', () => {
    render(<Button text="Click" onClick={vi.fn()} variant="error" />);

    const button = screen.getByRole('button');

    expect(button.className).toMatch(/error/);
  });

  it('is disabled when disabled prop is applies', () => {
    render(<Button text="Click" onClick={vi.fn()} disabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders button with default variant when props are not provided', () => {
    render(<Button text="Click" onClick={vi.fn()} />);

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();

    expect(button.className).toMatch(/basic/);
  });

  it('has correct button role', () => {
    render(<Button text="Click" onClick={vi.fn()} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
