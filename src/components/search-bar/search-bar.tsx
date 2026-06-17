import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { Button } from '@/components/button/button';
import { useDispatch } from 'react-redux';
import { useSearchQuery } from '@/store/api/api-endpoints';
import { getErrorMessage } from '@/utils/error-handlers';
import { ERROR_MESSAGES } from '@/constants/constants';
import {
  setLoading,
  setFetching,
  setError,
  setTotalPages,
  resetError,
} from '@/store/ui-state-slice';
import type { PokemonWithDescription } from '@/types/api';
import styles from './search-bar.module.css';

const cx = classNames.bind(styles);

type SearchBarProps = {
  value?: string;
  onSearch: (value: string) => void;
  onDataChange: (data: PokemonWithDescription[]) => void;
};

const normalize = (value: string): string => value.trim().toLowerCase();

export const SearchBar = ({
  value = '',
  onSearch,
  onDataChange,
}: SearchBarProps) => {
  const [query, setQuery] = useState(value);
  const [searchTerm, setSearchTerm] = useState(() => normalize(value));
  const dispatch = useDispatch();

  const {
    data: searchData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useSearchQuery(searchTerm, {
    skip: !searchTerm,
  });

  useEffect(() => {
    if (!searchTerm) {
      dispatch(resetError());
      onDataChange([]);
      return;
    }

    if (isLoading || isFetching) {
      dispatch(setLoading(true));
      dispatch(setFetching(true));
      return;
    }

    dispatch(setLoading(false));
    dispatch(setFetching(false));

    if (isError) {
      dispatch(setError(getErrorMessage(error)));
      onDataChange([]);
    } else if (searchData) {
      dispatch(setTotalPages(1));
      onDataChange([searchData]);
    } else if (searchData === null) {
      dispatch(setTotalPages(0));
      onDataChange([]);
      dispatch(setError(ERROR_MESSAGES.NOTFOUND));
    }
  }, [
    searchData,
    isLoading,
    isFetching,
    isError,
    error,
    searchTerm,
    dispatch,
    onDataChange,
  ]);

  const handleChange = (event_: ChangeEvent<HTMLInputElement>) => {
    setQuery(event_.target.value);
  };

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    setQuery(trimmedQuery);

    const normalized = normalize(trimmedQuery);
    if (normalized) {
      if (normalized !== searchTerm) {
        dispatch(resetError());
        onDataChange([]);
        setSearchTerm(normalized);
      }
      onSearch(trimmedQuery);
    } else {
      setSearchTerm('');
      onSearch('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={cx('search-container')}>
      <label htmlFor="search-input" className={cx('visually-hidden')}>
        Search Pokémon
      </label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search Pokémon..."
        className={cx('input')}
      />

      <Button text="Search" onClick={handleSearch} />
    </div>
  );
};
