import { useMemo } from 'react';
import type { Country } from '../../types';
import { VList } from 'virtua';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(() => {
    return countries
      .filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
        return matchesSearch && matchesRegion;
      })
      .map((country) => ({
        ...country,
        yearDataMap: createYearDataMap(country.data),
      }))
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        } else {
          const popA = getPopulationForYear(a.yearDataMap, selectedYear) || 0;
          const popB = getPopulationForYear(b.yearDataMap, selectedYear) || 0;
          return sortOrder === 'asc' ? popA - popB : popB - popA;
        }
      });
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  return (
    <VList className={styles.countryList}>
      {filteredCountries.map((country) => (
        <CountryCard
          key={country.id}
          country={country}
          selectedYear={selectedYear}
          selectedColumns={selectedColumns}
        />
      ))}
    </VList>
  );
};
