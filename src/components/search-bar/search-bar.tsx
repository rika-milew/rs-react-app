import classNames from 'classnames/bind';
import { useState } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { Button } from '@/components/button/button';
import styles from './search-bar.module.css';

const cx = classNames.bind(styles);

type SearchBarProps = {
  value?: string;
  onSearch: (value: string) => void;
};

export const SearchBar = ({ value = '', onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState(value);

  const handleChange = (event_: ChangeEvent<HTMLInputElement>) => {
    setQuery(event_.target.value);
  };

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    setQuery(trimmedQuery);
    onSearch(trimmedQuery);
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
