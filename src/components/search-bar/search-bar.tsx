import classNames from 'classnames/bind';
import { useState } from 'react';
import { Button } from '@/components/button/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import styles from './search-bar.module.css';

const cx = classNames.bind(styles);

type Props = {
  value?: string;
  onSearch: (value: string) => void;
};

export const SearchBar = ({ value = '', onSearch }: Props) => {
  const [savedSearch, setSavedSearch] = useLocalStorage('search', value);

  const [query, setQuery] = useState(savedSearch);

  const handleChange = (event_: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event_.target.value);
  };

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    setQuery(trimmedQuery);
    setSavedSearch(trimmedQuery);

    onSearch(trimmedQuery);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
