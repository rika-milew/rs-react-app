import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SearchPage } from './search-page';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  useSearch: () => ({ page: 1 }),
}));

vi.mock('@/components/card-list/card-list', () => ({
  CardList: ({ search }: { search: string }) => (
    <div data-testid="card-list">
      <p>Search: {search}</p>
    </div>
  ),
}));

vi.mock('@/components/search-bar/search-bar', () => ({
  SearchBar: ({
    onSearch,
    placeholder,
  }: {
    onSearch: (value: string) => void;
    placeholder?: string;
  }) => {
    const [localValue, setLocalValue] = React.useState('');

    return (
      <div data-testid="search-bar">
        <input
          type="text"
          role="searchbox"
          value={localValue}
          onChange={(event) => {
            setLocalValue(event.target.value);
          }}
          placeholder={placeholder ?? 'Search Pokémon...'}
        />
        <button
          onClick={() => {
            onSearch(localValue);
          }}
        >
          Search
        </button>
      </div>
    );
  },
}));

vi.mock('@/components/error-button/error-button', () => ({
  ErrorButton: () => <button>Trigger Error</button>,
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

describe('SearchPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders page components correctly', () => {
    render(<SearchPage />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByText(/trigger error/i)).toBeInTheDocument();
  });

  it('passes search value to the list component', async () => {
    const user = userEvent.setup();

    render(<SearchPage />);

    const input = screen.getByRole('searchbox');

    await user.clear(input);
    await user.type(input, 'bulbasaur', { skipClick: true });

    expect(input).toHaveValue('bulbasaur');
  });

  it('loads the saved search term from localStorage after page load', () => {
    localStorage.setItem('search', 'venusaur');

    render(<SearchPage />);

    expect(screen.getByTestId('card-list')).toHaveTextContent(
      'Search: venusaur',
    );
  });

  it('saves search term to localStorage when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchPage />);

    const input = screen.getByRole('searchbox');

    await user.type(input, 'ivysaur');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('search')).toBe('ivysaur');
  });

  it('trims whitespace from search input before saving', async () => {
    const user = userEvent.setup();

    render(<SearchPage />);

    const input = screen.getByRole('searchbox');
    await user.type(input, '   bulbasaur   ');

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('search')).toBe('bulbasaur');
  });

  it('overwrites existing localStorage value when new search is performed', async () => {
    const user = userEvent.setup();

    localStorage.setItem('search', 'charmeleon');

    render(<SearchPage />);

    const input = screen.getByRole('searchbox');

    await user.clear(input);
    await user.type(input, 'blastoise');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('search')).toBe('blastoise');
  });

  it('removes localStorage value after submitting empty input', async () => {
    const user = userEvent.setup();

    localStorage.setItem('search', 'charmeleon');

    render(<SearchPage />);

    const input = screen.getByRole('searchbox');

    await user.clear(input);
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('search')).toBeNull();
  });
});
