import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loader } from './loader';

describe('loader component', () => {
  it('renders loader by default', () => {
    render(<Loader />);

    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('renders loader when loading is true', () => {
    render(<Loader loading={true} />);

    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('does not render loader when loading is false', () => {
    render(<Loader loading={false} />);

    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  it('has loader container', () => {
    render(<Loader />);

    const container = screen.getByText('Loading…').closest('div');

    expect(container).not.toBeNull();

    if (container) {
      expect(container.className).toMatch(/loader/);
    }
  });
});
