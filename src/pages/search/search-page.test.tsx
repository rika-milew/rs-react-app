import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SearchPage } from './search-page';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('@/components/card-list/card-list', () => ({
  CardList: ({ search }: { search: string }) => (
    <div data-testid="card-list">
      <p>Search: {search}</p>
    </div>
  ),
}));

vi.mock('@/components/search-bar/search-bar', () => ({
  SearchBar: ({
    value = '',
    onSearch,
  }: {
    value?: string;
    onSearch: (value: string) => void;
  }) => (
    <div data-testid="search-bar">
      <input
        type="text"
        value={value}
        onChange={(event) => {
          onSearch(event.target.value);
        }}
        placeholder="Search Pokémon..."
      />
      <button
        onClick={() => {
          onSearch(value);
        }}
      >
        Search
      </button>
    </div>
  ),
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
      localStorage.setItem(key, newValue);
      setValue(newValue);
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

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText(/trigger error/i)).toBeInTheDocument();
    expect(screen.getByTestId('card-list')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('passes search value to the list component', async () => {
    const user = userEvent.setup();

    render(<SearchPage />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'bulbasaur');

    expect(input).toHaveValue('bulbasaur');
  });

  it('loads the saved search term from localStorage after page load', () => {
    localStorage.setItem('search', 'venusaur');

    render(<SearchPage />);

    expect(screen.getByDisplayValue('venusaur')).toBeInTheDocument();
  });
});
