import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundaryAdapter } from './error-boundary-adapter';

describe('ErrorBoundaryAdapter integration', () => {
  it('renders ErrorBoundary with no layout', () => {
    const mockError = new Error('Test error');
    const mockReset = vi.fn();

    render(<ErrorBoundaryAdapter error={mockError} reset={mockReset} />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
});
