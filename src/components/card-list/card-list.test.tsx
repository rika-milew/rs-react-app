import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CardList } from './card-list';
import userEvent from '@testing-library/user-event';
import { mockItemFull, mockItemPartial } from '@/test-utils/api-mock';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useDataList } from '@/hooks/use-data-list';
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

vi.mock('@tanstack/react-router', () => ({
  useSearch: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('@/hooks/use-data-list', () => ({
  useDataList: vi.fn(),
}));

describe('CardList component', () => {
  const mockNavigate = vi.fn();
  const mockLoadData = vi.fn();

  const renderWithProvider = (ui: React.ReactElement) => {
    const store = createMockStore();
    return {
      ...render(<Provider store={store}>{ui}</Provider>),
      store,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearch).mockReturnValue({ page: 1 });
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 0,
      status: 'loading',
      error: null,
      loadData: mockLoadData,
    });
  });

  it('renders loading state initially', () => {
    renderWithProvider(<CardList search="" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows pagination component when search input is empty', async () => {
    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 85,
      status: 'success',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="" />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    });
  });

  it('does not render pagination during search', () => {
    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 5,
      status: 'loading',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="venusaur" />);

    expect(
      screen.queryByRole('button', { name: /next/i }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /prev/i }),
    ).not.toBeInTheDocument();
  });

  it('renders item cards after successful search', async () => {
    vi.mocked(useDataList).mockReturnValue({
      data: [mockItemFull],
      totalPages: 1,
      status: 'success',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="" />);

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A strange seed was planted on its back at birth./i),
    ).toBeInTheDocument();
  });

  it('renders correct number of cards', async () => {
    vi.mocked(useDataList).mockReturnValue({
      data: [mockItemFull, mockItemPartial],
      totalPages: 1,
      status: 'success',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="" />);

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();

    const images = await screen.findAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('displays not found message when when api returns not-found state', async () => {
    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 0,
      status: 'not-found',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="unknown" />);

    expect(await screen.findByText(/pokemon not found/i)).toBeInTheDocument();
  });

  it('renders no cards when data is empty', () => {
    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 1,
      status: 'success',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="" />);

    const cards = screen.queryAllByRole('img');

    expect(cards).toHaveLength(0);
  });

  it('renders api error message when when api returns error state', async () => {
    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 0,
      status: 'error',
      error: 'Server error',
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="" />);

    expect(await screen.findByText(/server error/i)).toBeInTheDocument();
  });

  it('shows error state when API request fails', async () => {
    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 0,
      status: 'error',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="" />);

    expect(
      await screen.findByText(/something went wrong/i),
    ).toBeInTheDocument();
  });

  it('calls api with the search query', () => {
    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 1,
      status: 'success',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="bulbasaur" />);

    expect(mockLoadData).toHaveBeenCalledWith('bulbasaur', 0);
  });

  it('resets page to 0 when search changes', () => {
    vi.mocked(useSearch).mockReturnValue({ page: 3 });

    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 10,
      status: 'success',
      error: null,
      loadData: mockLoadData,
    });

    const { rerender } = renderWithProvider(<CardList search="bulbasaur" />);
    expect(mockLoadData).toHaveBeenCalledWith('bulbasaur', 2);
    vi.mocked(useSearch).mockReturnValue({ page: 1 });
    rerender(<CardList search="charmander" />);
    expect(mockLoadData).toHaveBeenCalledWith('charmander', 0);
    expect(mockLoadData).toHaveBeenCalledTimes(2);
  });

  it('loads next page when next button is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 10,
      status: 'success',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="" />);

    const nextButton = await screen.findByRole('button', { name: /next/i });

    await user.click(nextButton);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '.',
      search: { page: 2 },
      replace: true,
    });
  });

  it('loads previous page when previous button is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(useSearch).mockReturnValue({ page: 2 });

    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 10,
      status: 'success',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="" />);

    const nextButton = await screen.findByRole('button', { name: /next/i });
    await user.click(nextButton);

    const previousButton = await screen.findByRole('button', { name: /prev/i });
    await user.click(previousButton);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '.',
      search: { page: 1 },
      replace: true,
    });
  });

  it('stays on first page when prev is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(useSearch).mockReturnValue({ page: 1 });
    vi.mocked(useDataList).mockReturnValue({
      data: [],
      totalPages: 3,
      status: 'success',
      error: null,
      loadData: mockLoadData,
    });

    renderWithProvider(<CardList search="" />);

    const previousButton = await screen.findByRole('button', { name: /prev/i });
    await user.click(previousButton);

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(mockLoadData).toHaveBeenCalledTimes(1);
  });
});
