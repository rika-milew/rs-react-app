import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Layout } from './layout';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('@/components/theme-toggle/theme-toggle', () => ({
  ThemeToggle: () => <button>Toggle theme</button>,
}));

const createMockStore = (preloadedState?: Record<string, unknown>) => {
  const defaultState = { selectedItems: { selectedItems: [] } };

  return configureStore({
    reducer: {
      selectedItems: (state, _action) => state ?? { selectedItems: [] },
    },
    preloadedState: preloadedState ?? defaultState,
  });
};

describe('layout component', () => {
  const renderWithProvider = (ui: React.ReactElement, initialState = {}) => {
    const store = createMockStore(initialState);
    return {
      ...render(<Provider store={store}>{ui}</Provider>),
      store,
    };
  };

  const renderLayout = () =>
    renderWithProvider(
      <Layout>
        <div>Content</div>
      </Layout>
    );

  it('renders layout structure with header, footer and children', () => {
    renderLayout();

    expect(screen.getByText('Content')).toBeInTheDocument();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
