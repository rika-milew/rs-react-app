import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './error-boundary';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, type Store } from '@reduxjs/toolkit';
import selectedItemsReducer from '@/store/slice';

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

const TestError = ({ isError }: { isError: boolean }) => {
  if (isError) {
    throw new Error('Test error');
  }
  return <div>Expected content</div>;
};

vi.mock('@/components/theme-toggle/theme-toggle', () => ({
  ThemeToggle: () => <div>Toggle theme</div>,
}));

describe('ErrorBoundary component', () => {
  const renderWithProvider = (ui: React.ReactElement) => {
    const store = createMockStore();
    return {
      ...render(<Provider store={store}>{ui}</Provider>),
      store,
    };
  };

  beforeEach(() => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children components when no error occurs', () => {
    renderWithProvider(
      <ErrorBoundary>
        <div>App Content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('App Content')).toBeInTheDocument();
  });

  it('displays error message when child component throws an error', () => {
    renderWithProvider(
      <ErrorBoundary>
        <TestError isError={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('Please try again or reset the app.'),
    ).toBeInTheDocument();
  });

  it('renders try again button in error state', () => {
    renderWithProvider(
      <ErrorBoundary>
        <TestError isError={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('initial state has hasError: false', () => {
    renderWithProvider(
      <ErrorBoundary>
        <div>App Content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('App Content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('resets error state after clicking the reset button', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <ErrorBoundary>
        <TestError isError={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    const button = screen.getByRole('button', {
      name: /try again/i,
    });

    await user.click(button);

    expect(
      await screen.findByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
  });
});
