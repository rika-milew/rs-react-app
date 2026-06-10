import { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { Country } from '../../types';
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

type ItemData = {
  items: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

type ItemProps = {
  index: number;
  style: React.CSSProperties;
  data: ItemData;
};

const Item = ({ index, style, data }: ItemProps) => {
  const item = data.items[index];

  return (
    <div style={style} className={styles.row}>
      <CountryCard
        key={item.id}
        country={item}
        selectedYear={data.selectedYear}
        selectedColumns={data.selectedColumns}
      />
    </div>
  );
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

  const gap = 16;

  const itemSize = useMemo(() => {
    const baseHeight = 129;
    const columnHeight = 38;
    return baseHeight + selectedColumns.length * columnHeight + gap;
  }, [selectedColumns]);

  const itemData: ItemData = {
    items: filteredCountries,
    selectedYear,
    selectedColumns,
  };

  return (
    <div className={styles.countryList}>
      <List
        height={window.innerHeight - 300}
        itemCount={filteredCountries.length}
        itemSize={itemSize}
        width="100%"
        itemData={itemData}
      >
        {Item}
      </List>
    </div>
  );
};
