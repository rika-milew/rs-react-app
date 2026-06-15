import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SearchPage } from './search-page';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import type { ReactElement } from 'react';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => ({ page: 1 }),
}));

type MockRootState = {
  api: Record<string, never>;
};

const createMockStore = () =>
  configureStore<MockRootState>({
    reducer: {
      api: (state = {}) => state,
    },
  });

const renderWithProvider = (
  ui: ReactElement,
): ReturnType<typeof render> & { store: EnhancedStore<MockRootState> } => {
  const testStore = createMockStore();
  const utilities = render(<Provider store={testStore}>{ui}</Provider>);
  return { store: testStore, ...utilities };
};

vi.mock('@/components/card-list/card-list', () => ({
  CardList: ({
    data,
    isLoading,
    isError,
    isFetching,
    totalPages,
    onRefresh,
    onCardClick,
  }: {
    data: unknown[];
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    error: unknown;
    totalPages: number;
    onRefresh: () => void;
    onCardClick: (id: number) => void;
  }) => (
    <div data-testid="card-list">
      <p>Items: {data.length}</p>
      <p>Loading: {String(isLoading)}</p>
      <p>Error: {String(isError)}</p>
      <p>Fetching: {String(isFetching)}</p>
      <p>Total Pages: {totalPages}</p>
      <button onClick={onRefresh}>Refresh</button>
      <button onClick={() => onCardClick(1)}>Open Card</button>
    </div>
  ),
}));

vi.mock('@/components/search-bar/search-bar', () => ({
  SearchBar: ({
    value,
    onSearch,
  }: {
    value: string;
    onSearch: (value: string) => void;
    placeholder?: string;
  }) => {
    const [localValue, setLocalValue] = React.useState(value);

    return (
      <div data-testid="search-bar">
        <input
          type="text"
          role="searchbox"
          value={localValue}
          onChange={(event) => {
            setLocalValue(event.target.value);
          }}
          placeholder="Search Pokémon..."
        />
        <button
          onClick={() => {
            onSearch(localValue);
          }}
        >
          Search
        </button>
      </div>
    );
  },
}));

vi.mock('@/components/error-button/error-button', () => ({
  ErrorButton: () => <button>Trigger Error</button>,
}));

vi.mock('@/store/api/api-endpoints', () => ({
  useGetListQuery: () => ({
    data: undefined,
    isLoading: true,
    isError: false,
    isFetching: false,
    error: undefined,
  }),
  useSearchQuery: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
    isFetching: false,
    error: undefined,
  }),
  apiEndpoints: {
    util: {
      invalidateTags: vi.fn(),
    },
  },
}));

vi.mock('@/hooks/use-local-storage', () => ({
  useLocalStorage: (key: string, initialValue: string) => {
    const [value, setValue] = React.useState(() => {
      const stored = localStorage.getItem(key);
      return stored ?? initialValue;
    });

    const setStoredValue = (newValue: string) => {
      const processedValue = newValue.trim() || initialValue;
      if (processedValue) {
        localStorage.setItem(key, processedValue);
      } else {
        localStorage.removeItem(key);
      }
      setValue(processedValue);
    };

    return [value, setStoredValue];
  },
}));

describe('SearchPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders page components correctly', () => {
    renderWithProvider(<SearchPage />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByText(/trigger error/i)).toBeInTheDocument();
    expect(screen.getByTestId('card-list')).toBeInTheDocument();
  });

  it('loads the saved search term from localStorage after page load', () => {
    localStorage.setItem('search', 'venusaur');

    renderWithProvider(<SearchPage />);

    expect(screen.getByRole('searchbox')).toHaveValue('venusaur');
  });

  it('saves search term to localStorage when search button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<SearchPage />);

    const input = screen.getByRole('searchbox');

    await user.type(input, 'ivysaur');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('search')).toBe('ivysaur');
  });

  it('trims whitespace from search input before saving', async () => {
    const user = userEvent.setup();

    renderWithProvider(<SearchPage />);

    const input = screen.getByRole('searchbox');
    await user.type(input, '   bulbasaur   ');

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('search')).toBe('bulbasaur');
  });

  it('overwrites existing localStorage value when new search is performed', async () => {
    const user = userEvent.setup();

    localStorage.setItem('search', 'charmeleon');

    renderWithProvider(<SearchPage />);

    const input = screen.getByRole('searchbox');

    await user.clear(input);
    await user.type(input, 'blastoise');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('search')).toBe('blastoise');
  });

  it('removes localStorage value after submitting empty input', async () => {
    const user = userEvent.setup();

    localStorage.setItem('search', 'charmeleon');

    renderWithProvider(<SearchPage />);

    const input = screen.getByRole('searchbox');

    await user.clear(input);
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('search')).toBeNull();
  });
});
