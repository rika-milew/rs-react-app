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
    onSearchResult,
  }: {
    onSearchResult: (isActive: boolean, data: unknown[]) => void;
  }) => {
    const [localValue, setLocalValue] = React.useState('');

    const handleSearch = () => {
      if (localValue.trim()) {
        onSearchResult(true, []);
      } else {
        onSearchResult(false, []);
      }
    };

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
        <button onClick={handleSearch}>Search</button>
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

describe('SearchPage', () => {
  beforeEach(() => {
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

  it('calls navigate with page 1 when search becomes active', async () => {
    const user = userEvent.setup();
    renderWithProvider(<SearchPage />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'ivysaur');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '.',
      search: { page: 1 },
      replace: true,
    });
  });

  it('does not navigate when search becomes inactive', async () => {
    const user = userEvent.setup();
    renderWithProvider(<SearchPage />);

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to detail page when card is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<SearchPage />);

    await user.click(screen.getByText('Open Card'));

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/details/$detailId',
      params: { detailId: '1' },
      search: { page: 1 },
    });
  });

  it('passes empty data to CardList when no search and no list data', () => {
    renderWithProvider(<SearchPage />);

    expect(screen.getByText('Items: 0')).toBeInTheDocument();
  });
});
