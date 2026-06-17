import { render, screen, waitFor } from '@testing-library/react';
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

describe('SearchBar component', () => {
  const onSearch = vi.fn();
  const onDataChange = vi.fn();

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
    render(<SearchBar onSearch={onSearch} onDataChange={onDataChange} />);

    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays initial search term value from props', () => {
    render(
      <SearchBar value="bulbasaur" onSearch={vi.fn()} onDataChange={vi.fn()} />,
    );

    expect(screen.getByRole('searchbox')).toHaveValue('bulbasaur');
  });

  it('shows empty input when no saved term exists', () => {
    render(<SearchBar onSearch={onSearch} onDataChange={onDataChange} />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('');
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={vi.fn()} onDataChange={vi.fn()} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'bulbasaur');

    expect(input).toHaveValue('bulbasaur');
  });

  it('triggers search callback with correct parameters', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} onDataChange={vi.fn()} />);

    const input = screen.getByRole('searchbox');

    await user.type(input, '  bulbasaur   ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('bulbasaur');
  });

  it('calls search callback with empty string when input is empty', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearch} onDataChange={onDataChange} />);

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('dispatches loading state when search is loading', async () => {
    mockIsLoading = true;

    render(
      <SearchBar
        value="bulbasaur"
        onSearch={vi.fn()}
        onDataChange={onDataChange}
      />,
    );

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

    render(
      <SearchBar
        value="bulbasaur"
        onSearch={vi.fn()}
        onDataChange={onDataChange}
      />,
    );

    await waitFor(() => {
      expect(onDataChange).toHaveBeenCalledWith([mockSearchData]);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'uiState/setTotalPages',
        payload: 1,
      });
    });
  });

  it('dispatches not found when search returns null', async () => {
    mockSearchData = null;

    render(
      <SearchBar
        value="unknown"
        onSearch={vi.fn()}
        onDataChange={onDataChange}
      />,
    );

    await waitFor(() => {
      expect(onDataChange).toHaveBeenCalledWith([]);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'uiState/setError',
        payload: ERROR_MESSAGES.NOTFOUND,
      });
    });
  });

  it('dispatches error when search fails', async () => {
    mockIsError = true;
    mockError = { data: 'Server error' };

    render(
      <SearchBar value="test" onSearch={vi.fn()} onDataChange={onDataChange} />,
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'uiState/setError',
        payload: 'Server error',
      });
      expect(onDataChange).toHaveBeenCalledWith([]);
    });
  });
});
