import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Layout } from './layout';

describe('layout component', () => {
  const renderLayout = () =>
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

  it('renders layout structure with header, footer and children', () => {
    renderLayout();

    expect(screen.getByText('Content')).toBeInTheDocument();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
