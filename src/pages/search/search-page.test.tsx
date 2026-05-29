import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SearchPage } from './search-page';
import userEvent from '@testing-library/user-event';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  useSearch: () => ({ page: 1 }),
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

    await user.type(input, 'bulbasaur');

    expect(input).toHaveValue('bulbasaur');
  });

  it('loads the saved search term from localStorage after page load', () => {
    localStorage.setItem('search', 'venusaur');

    render(<SearchPage />);

    expect(screen.getByDisplayValue('venusaur')).toBeInTheDocument();
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
