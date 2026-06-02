import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorButton } from './error-button';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '@/components/error-boundary/error-boundary';
import { waitFor } from '@testing-library/react';
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

describe('ErrorButton component', () => {
  const renderWithProvider = (ui: ReactElement) => {
    const store = createMockStore();
    return {
      ...render(<Provider store={store}>{ui}</Provider>),
      store,
    };
  };

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('renders error button', () => {
    renderWithProvider(<ErrorButton />);
    expect(
      screen.getByRole('button', { name: 'Trigger error' }),
    ).toBeInTheDocument();
  });

  it('triggers error boundary when clicked', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>,
    );

    await user.click(screen.getByRole('button', { name: 'Trigger error' }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('has error variant class', () => {
    renderWithProvider(<ErrorButton />);

    const button = screen.getByRole('button', { name: 'Trigger error' });
    expect(button.className).toMatch(/error/);
  });
});
