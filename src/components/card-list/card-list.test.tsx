import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CardList } from './card-list';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { mockItemFull, mockItemPartial } from '@/test-utils/api-mock';

import { getData } from '@/services/data-service';

const createMockStore = (preloadedState?: Record<string, unknown>) => {
  const defaultState = { selectedItems: { selectedItems: [] } };

  return configureStore({
    reducer: {
      selectedItems: (state, _action) => state ?? { selectedItems: [] },
    },
    preloadedState: preloadedState ?? defaultState,
  });
};

vi.mock('@/services/data-service', () => ({
  getData: vi.fn(),
}));

const mockedData = vi.mocked(getData);

describe('CardList component', () => {
  const renderWithProvider = (ui: React.ReactElement, initialState = {}) => {
    const store = createMockStore(initialState);
    return {
      ...render(<Provider store={store}>{ui}</Provider>),
      store,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 1,
    });

    renderWithProvider(<CardList search="" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows pagination component when search input is empty', async () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 85,
    });

    renderWithProvider(<CardList search="" />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    });
  });

  it('does not render pagination during search', () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 5,
    });

    renderWithProvider(<CardList search="venusaur" />);

    expect(
      screen.queryByRole('button', { name: /next/i })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /prev/i })
    ).not.toBeInTheDocument();
  });

  it('renders item cards after successful search', async () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [mockItemFull],
      totalPages: 1,
    });

    renderWithProvider(<CardList search="" />);

    const image = await screen.findByRole('img', {
      name: /bulbasaur/i,
    });

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A strange seed was planted on its back at birth./i)
    ).toBeInTheDocument();

    expect(image).toBeInTheDocument();
  });

  it('renders correct number of cards', async () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [mockItemFull, mockItemPartial],
      totalPages: 1,
    });

    renderWithProvider(<CardList search="" />);

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();

    const images = await screen.findAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('displays not found message when when api returns not-found state', async () => {
    mockedData.mockResolvedValue({
      type: 'not-found',
    });

    renderWithProvider(<CardList search="unknown" />);

    expect(await screen.findByText(/pokemon not found/i)).toBeInTheDocument();
  });

  it('renders no cards when data is empty', () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 1,
    });

    renderWithProvider(<CardList search="" />);

    const cards = screen.queryAllByRole('img');

    expect(cards).toHaveLength(0);
  });

  it('renders api error message when when api returns error state', async () => {
    mockedData.mockResolvedValue({
      type: 'error',
      message: 'Server error',
    });

    renderWithProvider(<CardList search="" />);

    expect(await screen.findByText(/server error/i)).toBeInTheDocument();
  });

  it('shows error state when API request fails', async () => {
    mockedData.mockRejectedValue(new Error('Network failed'));

    renderWithProvider(<CardList search="" />);

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
  });

  it('calls api with normalized search query', async () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 1,
    });

    renderWithProvider(<CardList search="   BulBAsaur   " />);

    await waitFor(() => {
      expect(mockedData).toHaveBeenCalledWith(0, 'bulbasaur');
    });
  });

  it('resets page to 0 when search changes', async () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 10,
    });

    renderWithProvider(<CardList search="bulbasaur" />);

    renderWithProvider(<CardList search="charmander" />);

    await waitFor(() => {
      expect(mockedData).toHaveBeenLastCalledWith(0, 'charmander');
    });
  });

  it('loads next page when next button is clicked', async () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 10,
    });

    renderWithProvider(<CardList search="" />);

    await waitFor(() => {
      expect(mockedData).toHaveBeenCalledWith(0, '');
    });

    const nextButton = await screen.findByRole('button', { name: /next/i });

    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(mockedData).toHaveBeenLastCalledWith(1, '');
    });
  });

  it('loads previous page when previous button is clicked', async () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 10,
    });

    renderWithProvider(<CardList search="" />);

    const nextButton = await screen.findByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    const previousButton = await screen.findByRole('button', { name: /prev/i });
    await userEvent.click(previousButton);

    await waitFor(() => {
      expect(mockedData).toHaveBeenLastCalledWith(0, '');
    });
  });

  it('stays on first page when prev is clicked', async () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 3,
    });

    renderWithProvider(<CardList search="" />);

    const nextButton = await screen.findByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    const previousButton = await screen.findByRole('button', { name: /prev/i });
    await userEvent.click(previousButton);

    await waitFor(() => {
      expect(mockedData).toHaveBeenLastCalledWith(0, '');
    });
  });
});
