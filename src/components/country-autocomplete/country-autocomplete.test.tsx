import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CountryAutocomplete } from './country-autocomplete';
import { useCountriesStore } from '@/store/use-countries-store';

const mockCountries = ['Belarus', 'Russia', 'Poland'];
const EXPECTED_CALLS = 3;

const mockClassNames = vi.hoisted(
  (...args: (string | Record<string, boolean>)[]): string => {
    return args
      .flatMap((argument) => {
        if (typeof argument === 'string') {
          return argument;
        }
        return Object.entries(argument)
          .filter(([, value]) => value)
          .map(([key]) => key);
      })
      .join(' ');
  },
);

vi.mock('classnames/bind', () => ({
  default: () => mockClassNames,
}));

describe('CountryAutocomplete', () => {
  beforeEach(() => {
    useCountriesStore.setState({ countries: mockCountries });
  });

  it('renders input with placeholder', () => {
    render(<CountryAutocomplete name="country" />);

    const input = screen.getByPlaceholderText('Find your country...');
    expect(input).toBeInTheDocument();
  });

  it('renders hidden input with correct name', () => {
    render(<CountryAutocomplete name="country" />);

    const hiddenInput = screen.getByTestId('hidden-input');
    expect(hiddenInput).toHaveAttribute('name', 'country');
    expect(hiddenInput).toHaveAttribute('type', 'hidden');
  });

  it('shows country list on focus', async () => {
    const user = userEvent.setup();
    render(<CountryAutocomplete name="country" />);

    const input = screen.getByPlaceholderText('Find your country...');
    await user.click(input);

    mockCountries.forEach((country) => {
      expect(screen.getByText(country)).toBeInTheDocument();
    });
  });

  it('filters countries on input', async () => {
    const user = userEvent.setup();
    render(<CountryAutocomplete name="country" />);

    const input = screen.getByPlaceholderText('Find your country...');
    await user.type(input, 'Be');

    expect(screen.getByText('Belarus')).toBeInTheDocument();
    expect(screen.queryByText('Russia')).not.toBeInTheDocument();
    expect(screen.queryByText('Poland')).not.toBeInTheDocument();
  });

  it('selects country on click and closes list', async () => {
    const user = userEvent.setup();
    render(<CountryAutocomplete name="country" />);

    const input = screen.getByPlaceholderText('Find your country...');
    await user.click(input);
    await user.click(screen.getByText('Poland'));

    expect(input).toHaveValue('Poland');
    expect(screen.queryByText('Belarus')).not.toBeInTheDocument();
  });

  it('calls onChange when selecting country', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<CountryAutocomplete name="country" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Find your country...');
    await user.click(input);
    await user.click(screen.getByText('Poland'));

    expect(handleChange).toHaveBeenCalledWith('Poland');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<CountryAutocomplete name="country" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Find your country...');
    await user.type(input, 'Rus');

    expect(handleChange).toHaveBeenCalledWith('R');
    expect(handleChange).toHaveBeenCalledWith('Ru');
    expect(handleChange).toHaveBeenCalledWith('Rus');
    expect(handleChange).toHaveBeenCalledTimes(EXPECTED_CALLS);
  });

  it('closes list when clicking outside', async () => {
    const user = userEvent.setup();
    render(<CountryAutocomplete name="country" />);

    const input = screen.getByPlaceholderText('Find your country...');
    await user.click(input);
    expect(screen.getByText('Belarus')).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByText('Belarus')).not.toBeInTheDocument();
  });

  it('shows list when input is focused', async () => {
    const user = userEvent.setup();
    render(<CountryAutocomplete name="country" />);

    const input = screen.getByPlaceholderText('Find your country...');
    await user.click(input);

    expect(screen.getByText('Belarus')).toBeInTheDocument();
  });

  it('does not show list when no countries match', async () => {
    const user = userEvent.setup();
    render(<CountryAutocomplete name="country" />);

    const input = screen.getByPlaceholderText('Find your country...');
    await user.type(input, 'Swede');

    expect(screen.queryByText('Belarus')).not.toBeInTheDocument();
    expect(screen.queryByText('Russia')).not.toBeInTheDocument();
  });

  it('cleans up event listener on unmount', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(<CountryAutocomplete name="country" />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
