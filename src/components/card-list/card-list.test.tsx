import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CardList } from './card-list';
import { ERROR_MESSAGES } from '@/constants/constants';
import { mockItemFull, mockItemPartial } from '@/test-utils/api-mock';
import type { PokemonWithDescription } from '@/types/api';
import userEvent from '@testing-library/user-event';

const { mockUseSelector } = vi.hoisted(() => ({
  mockUseSelector: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useSelector: mockUseSelector,
}));

vi.mock('@/components/loader/loader', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
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
  Card: ({
    item,
    onClick,
  }: {
    item: PokemonWithDescription;
    variant?: string;
    onClick?: () => void;
  }) => (
    <div
      data-testid={`card-${String(item.id)}`}
      onClick={onClick}
      role="button"
    >
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

const mockUiState = (overrides = {}) => {
  const defaultState = {
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    totalPages: 0,
  };

  mockUseSelector.mockReturnValue({
    ...defaultState,
    ...overrides,
  });
};

const defaultProps = {
  data: [],
  onRefresh: vi.fn(),
  onCardClick: vi.fn(),
};

describe('CardList component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUiState();
  });

  it('renders loading state correctly', () => {
    mockUiState({ isLoading: true });
    render(<CardList {...defaultProps} />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('shows loader when fetching data', () => {
    mockUiState({ isFetching: true, totalPages: 1 });
    render(<CardList {...defaultProps} data={[mockItemFull]} />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });

  it('renders item cards after successful search', () => {
    mockUiState({ totalPages: 1 });
    render(<CardList {...defaultProps} data={[mockItemFull]} />);

    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A strange seed was planted on its back at birth./i),
    ).toBeInTheDocument();
  });

  it('renders correct number of cards', () => {
    mockUiState({ totalPages: 1 });
    render(
      <CardList {...defaultProps} data={[mockItemFull, mockItemPartial]} />,
    );

    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
  });

  it('displays not found message when api returns not-found state', () => {
    mockUiState({ isFetching: false, totalPages: 0 });
    render(<CardList {...defaultProps} data={[]} />);

    expect(screen.getByText(ERROR_MESSAGES.NOTFOUND)).toBeInTheDocument();
  });

  it('shows error state when isError is true', () => {
    mockUiState({ isError: true, error: 'Server error' });
    render(<CardList {...defaultProps} />);

    expect(screen.getByText(/server error/i)).toBeInTheDocument();
  });

  it('calls onCardClick when card is clicked', async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();

    mockUiState({ totalPages: 1 });
    render(
      <CardList
        {...defaultProps}
        data={[mockItemFull]}
        onCardClick={onCardClick}
      />,
    );

    await user.click(screen.getByTestId('card-1'));

    expect(onCardClick).toHaveBeenCalledWith(1);
  });

  it('calls onRefresh when refresh button is clicked', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();

    mockUiState({ totalPages: 1 });
    render(
      <CardList
        {...defaultProps}
        data={[mockItemFull]}
        onRefresh={onRefresh}
      />,
    );

    await user.click(screen.getByRole('button', { name: /refresh/i }));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows pagination when not fetching', () => {
    mockUiState({ totalPages: 67 });
    render(<CardList {...defaultProps} data={[mockItemFull]} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText(/Total: 67/)).toBeInTheDocument();
  });

  it('hides pagination when fetching', () => {
    mockUiState({ isFetching: true, totalPages: 67 });
    render(<CardList {...defaultProps} data={[mockItemFull]} />);

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('does not show error state when data is empty but fetching', () => {
    mockUiState({ isFetching: true, totalPages: 0 });
    render(<CardList {...defaultProps} data={[]} />);

    expect(screen.queryByText(ERROR_MESSAGES.NOTFOUND)).not.toBeInTheDocument();
  });
});
