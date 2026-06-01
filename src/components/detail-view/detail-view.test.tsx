import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetailView } from './detail-view';
import { API_STATUS, ERROR_MESSAGES } from '@/constants/constants';
import type { PokemonWithDescription } from '@/types/api';
import { mockItemFull } from '@/test-utils/api-mock';
import userEvent from '@testing-library/user-event';
import { useGetDetailQuery } from '@/store/api/api-endpoints';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';

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
  ui: React.ReactElement,
): ReturnType<typeof render> & { store: EnhancedStore<MockRootState> } => {
  const testStore = createMockStore();
  const utilities = render(<Provider store={testStore}>{ui}</Provider>);
  return { store: testStore, ...utilities };
};

const { mockInvalidateTags } = vi.hoisted(() => ({
  mockInvalidateTags: vi.fn(() => ({
    type: 'api/invalidateTags',
    payload: [],
  })),
}));

vi.mock('@/store/api/api-endpoints', () => ({
  useGetDetailQuery: vi.fn(),
  apiEndpoints: {
    util: {
      invalidateTags: mockInvalidateTags,
    },
  },
}));

const mockNavigate = vi.fn();
const mockSearch = { search: 'pikachu', page: 1 };

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockSearch,
}));

vi.mock('@/components/card/card', () => ({
  Card: vi.fn(
    ({ item, variant }: { item: PokemonWithDescription; variant: string }) => (
      <div data-testid="card" data-variant={variant}>
        {item.name}
      </div>
    ),
  ),
}));

vi.mock('@/components/loader/loader', () => ({
  Loader: vi.fn(() => <div data-testid="loader">Loading...</div>),
}));

vi.mock('@/components/error-state/error-state', () => ({
  ErrorState: vi.fn(
    ({ message, onReload }: { message: string; onReload: () => void }) => (
      <div data-testid="error-state">
        <span>{message}</span>
        <button data-testid="reload-button" onClick={onReload}>
          Reload
        </button>
      </div>
    ),
  ),
}));

describe('DetailView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders card with data when correctly', () => {
    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        status: API_STATUS.SUCCESS,
        data: mockItemFull,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWithProvider(<DetailView detailId="1" />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText(mockItemFull.name)).toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-state')).not.toBeInTheDocument();
  });

  it('renders loader when the content is loading', () => {
    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      refetch: vi.fn(),
    });

    renderWithProvider(<DetailView detailId="1" />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-state')).not.toBeInTheDocument();
  });

  it('renders error message when status is error', async () => {
    const errorMessage = ERROR_MESSAGES.DEFAULT;

    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        status: API_STATUS.ERROR,
        message: errorMessage,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWithProvider(<DetailView detailId="1" />);

    expect(await screen.findByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('renders not found message when status is not found error', async () => {
    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        status: API_STATUS.NOT_FOUND,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWithProvider(<DetailView detailId="1" />);

    expect(await screen.findByTestId('error-state')).toBeInTheDocument();
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

    renderWithProvider(<DetailView detailId="1" />);

    const closeButton = screen.getByText('✕');
    await user.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/', search: mockSearch });
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

    renderWithProvider(<DetailView detailId="1" />);

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

    renderWithProvider(<DetailView detailId="1" />);

    await user.click(document.body);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('shows cached data without loading on subsequent renders with the same item id', () => {
    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        status: API_STATUS.SUCCESS,
        data: mockItemFull,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    const { rerender, store } = renderWithProvider(<DetailView detailId="1" />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();

    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        status: API_STATUS.SUCCESS,
        data: mockItemFull,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    rerender(
      <Provider store={store}>
        <DetailView detailId="1" />
      </Provider>,
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('shows loading state when item id changes and new detail data is loading', () => {
    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        status: API_STATUS.SUCCESS,
        data: mockItemFull,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    const { rerender, store } = renderWithProvider(<DetailView detailId="1" />);

    expect(screen.getByTestId('card')).toBeInTheDocument();

    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      refetch: vi.fn(),
    });

    rerender(
      <Provider store={store}>
        <DetailView detailId="2" />
      </Provider>,
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
  });

  it('invalidates cache when refresh button is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        status: API_STATUS.SUCCESS,
        data: mockItemFull,
      },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWithProvider(<DetailView detailId="1" />);

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    expect(mockInvalidateTags).toHaveBeenCalledWith([
      { type: 'Detail', id: '1' },
    ]);
  });

  it('shows updating text on refresh button during refetch', () => {
    vi.mocked(useGetDetailQuery).mockReturnValue({
      data: {
        status: API_STATUS.SUCCESS,
        data: mockItemFull,
      },
      isLoading: false,
      isFetching: true,
      refetch: vi.fn(),
    });

    renderWithProvider(<DetailView detailId="1" />);

    const refreshButton = screen.getByRole('button', { name: /updating/i });
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton).toBeDisabled();
  });
});
