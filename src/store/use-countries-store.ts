import { create } from 'zustand';
import { COUNTRIES } from '@/constants/constants';

type CountriesStore = {
  countries: string[];
};

export const useCountriesStore = create<CountriesStore>(() => ({
  countries: COUNTRIES,
}));
