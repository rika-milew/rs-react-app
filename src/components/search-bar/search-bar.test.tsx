import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './search-bar';
import { ERROR_MESSAGES } from '@/constants/constants';

const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

const mockRefetch = vi.fn();
let mockSearchData: unknown = undefined;
let mockIsLoading = false;
let mockIsFetching = false;
let mockIsError = false;
let mockError: unknown = undefined;

vi.mock('@/store/api/api-endpoints', () => ({
  useSearchQuery: (_term: string, { skip }: { skip: boolean }) => {
    if (skip) {
      return {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
        refetch: mockRefetch,
      };
    }

    return {
      data: mockSearchData,
      isLoading: mockIsLoading,
      isFetching: mockIsFetching,
      isError: mockIsError,
      error: mockError,
      refetch: mockRefetch,
    };
  },
}));

vi.mock('@/utils/error-handlers', () => ({
  getErrorMessage: vi.fn((error: unknown) => {
    if (error && typeof error === 'object' && 'data' in error) {
      return (error as { data: string }).data;
    }
    return ERROR_MESSAGES.DEFAULT;
  }),
}));

vi.mock('@/components/button/button', () => ({
  Button: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick}>{text}</button>
  ),
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

describe('SearchBar component', () => {
  const onSearchResult = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockSearchData = undefined;
    mockIsLoading = false;
    mockIsFetching = false;
    mockIsError = false;
    mockError = undefined;
  });

  it('renders search input and search button', () => {
    render(<SearchBar onSearchResult={onSearchResult} />);

    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays saved search term from localStorage on initial render', () => {
    localStorage.setItem('search', 'bulbasaur');

    render(<SearchBar onSearchResult={onSearchResult} />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('bulbasaur');
  });

  it('shows empty input when no saved term exists', () => {
    render(<SearchBar onSearchResult={onSearchResult} />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('');
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearchResult={onSearchResult} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'bulbasaur');

    expect(input).toHaveValue('bulbasaur');
  });

  it('triggers search callback with correct parameters', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearchResult={onSearchResult} />);

    const input = screen.getByRole('searchbox');

    await user.type(input, '  bulbasaur   ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(input).toHaveValue('bulbasaur');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'uiState/resetError',
    });
  });

  it('calls search callback with empty string when input is empty', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearchResult={onSearchResult} />);

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'uiState/resetError',
    });
    expect(onSearchResult).toHaveBeenCalledWith(false, []);
  });

  it('dispatches loading state when search is loading', async () => {
    mockIsLoading = true;

    localStorage.setItem('search', JSON.stringify('bulbasaur'));

    render(<SearchBar onSearchResult={onSearchResult} />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'uiState/setLoading',
        payload: true,
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'uiState/setFetching',
        payload: true,
      });
    });
  });

  it('dispatches result when search data is found', async () => {
    mockSearchData = {
      id: 1,
      name: 'bulbasaur',
      description: 'A strange seed was planted on its back at birth.',
    };

    localStorage.setItem('search', JSON.stringify('bulbasaur'));

    render(<SearchBar onSearchResult={onSearchResult} />);

    await waitFor(() => {
      expect(onSearchResult).toHaveBeenCalledWith(true, [mockSearchData]);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'uiState/setTotalPages',
        payload: 1,
      });
    });
  });

  it('dispatches not found when search returns null', async () => {
    mockSearchData = null;

    localStorage.setItem('search', JSON.stringify('unknown'));

    render(<SearchBar onSearchResult={onSearchResult} />);

    await waitFor(() => {
      expect(onSearchResult).toHaveBeenCalledWith(true, []);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'uiState/setError',
        payload: ERROR_MESSAGES.NOTFOUND,
      });
    });
  });

  it('dispatches error when search fails', async () => {
    mockIsError = true;
    mockError = { data: 'Server error' };

    localStorage.setItem('search', JSON.stringify('test'));

    render(<SearchBar onSearchResult={onSearchResult} />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'uiState/setError',
        payload: 'Server error',
      });
      expect(onSearchResult).toHaveBeenCalledWith(true, []);
    });
  });
});
