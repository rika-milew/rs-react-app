import classNames from 'classnames/bind';
import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useCountriesStore } from '@/store/use-countries-store';
import styles from './country-autocomplete.module.css';

const cx = classNames.bind(styles);

type CountryAutocompleteProps = {
  name: string;
  error?: string;
  onChange?: (value: string) => void;
};

export function CountryAutocomplete({
  name,
  error,
  onChange,
}: CountryAutocompleteProps) {
  const countries = useCountriesStore((state) => state.countries);
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCountries = countries.filter((country) =>
    country.toLowerCase().includes(inputValue.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setList(true);
    onChange?.(event.target.value);
  };

  const handleSelect = (country: string) => {
    setInputValue(country);
    setList(false);
    onChange?.(country);
  };

  return (
    <div ref={containerRef} className={cx('autocomplete', { error: !!error })}>
      <input
        type="hidden"
        name={name}
        value={inputValue}
        data-testid="hidden-input"
      />
      <input
        type="text"
        value={inputValue}
        onChange={handleInput}
        onFocus={() => setList(true)}
        placeholder="Find your country..."
        autoComplete="off"
      />
      {list && visibleCountries.length > 0 && (
        <div className={cx('list')}>
          {visibleCountries.map((country) => (
            <div
              key={country}
              className={cx('item')}
              onClick={() => handleSelect(country)}
            >
              {country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
