import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CardList } from './card-list';
import { useGetListQuery, useSearchQuery } from '@/store/api/api-endpoints';
import { API_STATUS, ERROR_MESSAGES } from '@/constants/constants';
import { mockItemFull, mockItemPartial } from '@/test-utils/api-mock';
import type { PokemonWithDescription } from '@/types/api';

const mockNavigate = vi.fn();
const mockSearchParams = { page: 1 };

vi.mock('@/store/api/api-endpoints', () => ({
  useGetListQuery: vi.fn(),
  useSearchQuery: vi.fn(),
  useGetDetailQuery: vi.fn(),
}));

const mockUseGetListQuery = vi.mocked(useGetListQuery);
const mockUseSearchQuery = vi.mocked(useSearchQuery);

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockSearchParams,
}));

vi.mock('@/hooks/use-pagination', () => ({
  usePagination: vi.fn(() => ({
    page: 0,
    setPage: vi.fn(),
    setTotalPages: vi.fn(),
    handlePrevious: vi.fn(),
    handleNext: vi.fn(),
  })),
}));

vi.mock('@/components/loader/loader', () => ({
  Loader: () => <div>Loading...</div>,
}));

vi.mock('@/components/error-state/error-state', () => ({
  ErrorState: ({
    message,
    onReload,
  }: {
    message: string;
    onReload: () => void;
  }) => (
    <div>
      <p>{message}</p>
      <button onClick={onReload}>Try again</button>
    </div>
  ),
}));

vi.mock('@/components/card/card', () => ({
  Card: ({ item }: { item: PokemonWithDescription }) => (
    <div data-testid={`card-${String(item.id)}`}>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </div>
  ),
}));

vi.mock('@/components/pagination/pagination', () => ({
  Pagination: ({ totalPages }: { totalPages: number }) => (
    <div data-testid="pagination">
      <button>Prev</button>
      <span>Page</span>
      <button>Next</button>
      <span>Total: {totalPages}</span>
    </div>
  ),
}));

describe('CardList component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.page = 1;

    mockUseGetListQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      refetch: vi.fn(),
    });

    mockUseSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  it('renders loading state initially', () => {
    mockUseGetListQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      refetch: vi.fn(),
    });

    mockUseSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<CardList search="" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows pagination component when search input is empty', async () => {
    mockUseGetListQuery.mockReturnValue({
      data: {
        status: API_STATUS.SUCCESS,
        data: [],
        totalPages: 67,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    mockUseSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });
    render(<CardList search="" />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    });
  });

  it('renders item cards after successful search', async () => {
    mockUseGetListQuery.mockReturnValue({
      data: {
        status: API_STATUS.SUCCESS,
        data: [mockItemFull],
        totalPages: 1,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    mockUseSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<CardList search="" />);

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A strange seed was planted on its back at birth./i),
    ).toBeInTheDocument();
  });

  it('renders correct number of cards', async () => {
    mockUseGetListQuery.mockReturnValue({
      data: {
        status: API_STATUS.SUCCESS,
        data: [mockItemFull, mockItemPartial],
        totalPages: 1,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    mockUseSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<CardList search="" />);

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
  });

  it('displays not found message when when api returns not-found state', async () => {
    mockUseGetListQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    mockUseSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      error: {
        status: 404,
        data: 'Not found',
      },
      refetch: vi.fn(),
    });

    render(<CardList search="unknown" />);

    expect(
      await screen.findByText(ERROR_MESSAGES.NOTFOUND),
    ).toBeInTheDocument();
    expect(screen.getByText(ERROR_MESSAGES.NOTFOUND)).toBeInTheDocument();
  });

  it('renders no cards when data is empty', () => {
    mockUseGetListQuery.mockReturnValue({
      data: {
        status: API_STATUS.SUCCESS,
        data: [],
        totalPages: 1,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    mockUseSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<CardList search="" />);

    const cards = screen.queryAllByRole('img');

    expect(cards).toHaveLength(0);
  });

  it('renders api error message when when api returns error state', async () => {
    mockUseGetListQuery.mockReturnValue({
      data: {
        status: API_STATUS.ERROR,
        message: 'Server error',
      },
      isLoading: false,
      isFetching: false,
      isError: true,
      refetch: vi.fn(),
    });

    mockUseSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<CardList search="" />);

    expect(await screen.findByText(ERROR_MESSAGES.DEFAULT)).toBeInTheDocument();
  });

  it('shows error state when API request fails', async () => {
    mockUseGetListQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: { message: 'Network failed' },
      refetch: vi.fn(),
    });

    mockUseSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<CardList search="" />);

    expect(
      await screen.findByText(/something went wrong/i),
    ).toBeInTheDocument();
  });

  it('calls api with normalized search query', () => {
    mockUseGetListQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<CardList search="   BulBAsaur   " />);

    expect(mockUseSearchQuery).toHaveBeenCalledWith('bulbasaur', {
      skip: false,
    });
  });
});
