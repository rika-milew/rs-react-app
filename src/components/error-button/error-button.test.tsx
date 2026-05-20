import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorButton } from './error-button';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '@/components/error-boundary/error-boundary';
import { waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const createMockStore = (preloadedState?: Record<string, unknown>) => {
  const defaultState = { selectedItems: { selectedItems: [] } };

  return configureStore({
    reducer: {
      selectedItems: (state, _action) => state ?? { selectedItems: [] },
    },
    preloadedState: preloadedState ?? defaultState,
  });
};

describe('ErrorButton component', () => {
  const renderWithProvider = (ui: React.ReactElement, initialState = {}) => {
    const store = createMockStore(initialState);
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
      screen.getByRole('button', { name: 'Trigger error' })
    ).toBeInTheDocument();
  });

  it('triggers error boundary when clicked', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('has error variant class', () => {
    renderWithProvider(<ErrorButton />);

    const button = screen.getByRole('button');
    expect(button.className).toMatch(/error/);
  });
});
