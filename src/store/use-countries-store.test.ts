import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCountriesStore } from './use-countries-store';

const mockCountries = vi.hoisted(() => ['Belarus', 'Russia', 'Poland']);

vi.mock('@/constants/constants', () => ({
  COUNTRIES: mockCountries,
}));

describe('useCountriesStore', () => {
  beforeEach(() => {
    useCountriesStore.setState({ countries: mockCountries });
  });

  it('initializes with countries from constants', () => {
    const { countries } = useCountriesStore.getState();

    expect(countries).toEqual(mockCountries);
    expect(countries).toHaveLength(mockCountries.length);
  });

  it('provides access to countries array', () => {
    const state = useCountriesStore.getState();

    expect(state.countries).toBeDefined();
    expect(Array.isArray(state.countries)).toBe(true);
    expect(state.countries).toContain('Belarus');
  });

  it('allows state updates', () => {
    const newCountries = ['China', 'Germany'];

    useCountriesStore.setState({ countries: newCountries });

    expect(useCountriesStore.getState().countries).toEqual(newCountries);
  });
});
