import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from './layout';
import { Provider } from 'react-redux';
import { configureStore, type Store } from '@reduxjs/toolkit';
import type { ReactElement } from 'react';
import selectedItemsReducer from '@/store/slice';

vi.mock('@/components/theme-toggle/theme-toggle', () => ({
  ThemeToggle: () => <button>Toggle theme</button>,
}));

type RootState = {
  selectedItems: ReturnType<typeof selectedItemsReducer>;
};

const createMockStore = (): Store<RootState> => {
  return configureStore<RootState>({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
  });
};

describe('layout component', () => {
  const renderWithProvider = (ui: ReactElement) => {
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
