import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SearchPage } from './search-page';
import userEvent from '@testing-library/user-event';

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
