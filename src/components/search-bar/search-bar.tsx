import classNames from 'classnames/bind';
import { useState, useEffect, useCallback } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { Button } from '@/components/button/button';
import { useDispatch } from 'react-redux';
import { useSearchQuery } from '@/store/api/api-endpoints';
import { getErrorMessage } from '@/utils/error-handlers';
import { useLocalStorage } from '@/hooks/use-local-storage';
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
  onSearchResult: (isActive: boolean, data: PokemonWithDescription[]) => void;
};

const normalize = (value: string): string => value.trim().toLowerCase();

export const SearchBar = ({ onSearchResult }: SearchBarProps) => {
  const [savedQuery, setSavedQuery] = useLocalStorage('search', '');
  const [query, setQuery] = useState(savedQuery);
  const [searchTerm, setSearchTerm] = useState(() => normalize(savedQuery));
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
      onSearchResult(false, []);
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
      onSearchResult(true, []);
    } else if (searchData) {
      dispatch(setTotalPages(1));
      onSearchResult(true, [searchData]);
    } else if (searchData === null) {
      dispatch(setTotalPages(0));
      onSearchResult(true, []);
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
    onSearchResult,
  ]);

  const handleChange = (event_: ChangeEvent<HTMLInputElement>) => {
    setQuery(event_.target.value);
  };

  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    setQuery(trimmedQuery);
    setSavedQuery(trimmedQuery);

    const normalized = normalize(trimmedQuery);
    if (normalized && normalized !== searchTerm) {
      dispatch(resetError());
      setSearchTerm(normalized);
    } else if (!normalized) {
      dispatch(resetError());
      setSearchTerm('');
    }
  }, [query, searchTerm, dispatch, setSavedQuery]);

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
