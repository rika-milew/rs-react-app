import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Layout } from './layout';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/store/api/api-slice';

vi.mock('@/components/theme-toggle/theme-toggle', () => ({
  ThemeToggle: () => <button>Toggle theme</button>,
}));

const EMPTY_STORE: string[] = [];
const INITIAL_SELECTED_ITEMS = { selectedItems: EMPTY_STORE };

const createMockStore = () => {
  return configureStore({
    reducer: {
      selectedItems: (state = INITIAL_SELECTED_ITEMS) => state,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
  });
};

describe('layout component', () => {
  const renderWithProvider = (ui: React.ReactElement) => {
    const store = createMockStore();
    return {
      ...render(<Provider store={store}>{ui}</Provider>),
      store,
    };
  };

  const renderLayout = () =>
    renderWithProvider(
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
