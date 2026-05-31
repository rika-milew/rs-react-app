import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './search-bar';

describe('SearchBar component', () => {
  const onSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders search input and search button', () => {
    render(<SearchBar onSearch={onSearch} />);

    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays initial search term value from props', () => {
    render(<SearchBar value="bulbasaur" onSearch={vi.fn()} />);

    expect(screen.getByRole('searchbox')).toHaveValue('bulbasaur');
  });

  it('shows empty input when no saved term exists', () => {
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('');
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'bulbasaur');

    expect(input).toHaveValue('bulbasaur');
  });

  it('triggers search callback with correct parameters', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('searchbox');

    await user.type(input, '  bulbasaur   ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('bulbasaur');
  });

  it('calls search callback with empty string when input is empty', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearch} />);

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(onSearch).toHaveBeenCalledWith('');
  });
});
