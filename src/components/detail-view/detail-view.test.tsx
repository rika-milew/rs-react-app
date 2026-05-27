import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetailView } from './detail-view';
import { API_STATUS, ERROR_MESSAGES } from '@/constants/constants';
import type { PokemonWithDescription } from '@/types/api';
import { mockItemFull } from '@/test-utils/api-mock';
import userEvent from '@testing-library/user-event';
import { useGetDetailQuery } from '@/store/api/api-endpoints';

vi.mock('@/store/api/api-endpoints', () => ({
  useGetDetailQuery: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/components/card/card', () => ({
  Card: vi.fn(
    ({ item, variant }: { item: PokemonWithDescription; variant: string }) => (
      <div data-testid="card" data-variant={variant}>
        {item.name}
      </div>
    )
  ),
}));

vi.mock('@/components/loader/loader', () => ({
  Loader: vi.fn(() => <div data-testid="loader">Loading...</div>),
}));

vi.mock('@/components/state-view/state-view', () => ({
  StateView: vi.fn(
    ({ message, onReload }: { message: string; onReload: () => void }) => (
      <div data-testid="state-view">
        <span>{message}</span>
        <button data-testid="reload-button" onClick={onReload}>
          Reload
        </button>
      </div>
    )
  ),
}));

describe('DetailView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders card with data when correctly', async () => {
    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        type: API_STATUS.SUCCESS,
        data: mockItemFull,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    render(<DetailView detailId="1" />);

    expect(await screen.findByTestId('card')).toBeInTheDocument();
    expect(screen.getByText(mockItemFull.name)).toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('state-view')).not.toBeInTheDocument();
  });

  it('renders loader when the content is loading', () => {
    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      refetch: vi.fn(),
    });

    render(<DetailView detailId="1" />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('state-view')).not.toBeInTheDocument();
  });

  it('renders error message when status is error', async () => {
    const errorMessage = 'Failed to get data';

    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        type: API_STATUS.ERROR,
        message: errorMessage,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    render(<DetailView detailId="1" />);

    expect(await screen.findByTestId('state-view')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('renders not found message when status is not found error', async () => {
    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        type: API_STATUS.NOT_FOUND,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    render(<DetailView detailId="1" />);

    expect(await screen.findByTestId('state-view')).toBeInTheDocument();
    expect(screen.getByText(ERROR_MESSAGES.NOTFOUND)).toBeInTheDocument();
    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('close the card when close button is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        type: API_STATUS.SUCCESS,
        data: mockItemFull,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    render(<DetailView detailId="1" />);

    const closeButton = screen.getByText('✕');
    await user.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/',
      search: { page: 1 },
    });
  });

  it('does not close the card when clicking on the detail card', async () => {
    const user = userEvent.setup();

    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        type: API_STATUS.SUCCESS,
        data: mockItemFull,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    render(<DetailView detailId="1" />);

    const detailElement = screen.getByRole('complementary');

    await user.click(detailElement);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('closes the card when clicking outside detail and card elements', async () => {
    const user = userEvent.setup();

    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        type: API_STATUS.SUCCESS,
        data: mockItemFull,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    render(<DetailView detailId="1" />);

    await user.click(document.body);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
