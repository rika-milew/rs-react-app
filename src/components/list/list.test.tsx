import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { List } from './list';

import { mockPokemonFull, mockPokemonPartial } from '@/test-utils/api-mock';

import { getData } from '@/services/data-service';

vi.mock('@/services/data-service', () => ({
  getData: vi.fn(),
}));

const mockedData = vi.mocked(getData);

describe('list component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 1,
    });

    render(<List search="" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows pagination component when search input is empty', async () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 85,
    });

    render(<List search="" />);

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

    render(<List search="venusaur" />);

    expect(
      screen.queryByRole('button', { name: /next/i })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /prev/i })
    ).not.toBeInTheDocument();
  });

  it('renders pokemon cards after successful search', async () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [mockPokemonFull],
      totalPages: 1,
    });

    render(<List search="" />);

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
      data: [mockPokemonFull, mockPokemonPartial],
      totalPages: 1,
    });

    render(<List search="" />);

    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();

    const images = await screen.findAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('displays not found message when when api returns not-found state', async () => {
    mockedData.mockResolvedValue({
      type: 'not-found',
    });

    render(<List search="unknown" />);

    expect(await screen.findByText(/pokemon not found/i)).toBeInTheDocument();
  });

  it('renders no cards when data is empty', () => {
    mockedData.mockResolvedValue({
      type: 'success',
      data: [],
      totalPages: 1,
    });

    render(<List search="" />);

    const cards = screen.queryAllByRole('img');

    expect(cards).toHaveLength(0);
  });

  it('renders api error message when when api returns error state', async () => {
    mockedData.mockResolvedValue({
      type: 'error',
      message: 'Server error',
    });

    render(<List search="" />);

    expect(await screen.findByText(/server error/i)).toBeInTheDocument();

    screen.debug();
  });

  it('shows error state when API request fails', async () => {
    mockedData.mockRejectedValue(new Error('Network failed'));

    render(<List search="" />);

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

    render(<List search="   BulBAsaur   " />);

    await waitFor(() => {
      expect(mockedData).toHaveBeenCalledWith(0, 'bulbasaur');
    });
  });
});
