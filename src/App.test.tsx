import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import App from './App';

vi.mock('@/components/layout/layout', () => ({
  Layout: vi.fn(({ children }: { children: ReactNode }) => (
    <div data-testid="layout">{children}</div>
  )),
}));

vi.mock('@/pages/home/home-page', () => ({
  HomePage: vi.fn(() => <div data-testid="home-page">Home Page</div>),
}));

describe('app component', () => {
  it('renders layout with home page inside', () => {
    render(<App />);

    const layout = screen.getByTestId('layout');
    const homePage = screen.getByTestId('home-page');

    expect(layout).toBeInTheDocument();
    expect(layout).toContainElement(homePage);
  });

  it('renders the complete app structure', () => {
    const { container } = render(<App />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(container.firstChild).toBe(screen.getByTestId('layout'));
  });

  it('passes children to the layout correctly', () => {
    render(<App />);

    const layout = screen.getByTestId('layout');
    const homePage = screen.getByTestId('home-page');

    expect(layout.children.length).toBe(1);
    expect(layout.firstChild).toBe(homePage);
  });
});
