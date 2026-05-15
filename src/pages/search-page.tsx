import { List } from '@/components/card-list/card-list';
import { SearchBar } from '@/components/search-bar/search-bar';
import { ErrorButton } from '@/components/error-button/error-button';

import { useLocalStorage } from '@/hooks/use-local-storage';

export const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useLocalStorage('search', '');

  return (
    <>
      <SearchBar value={searchQuery} onSearch={setSearchQuery} />
      <List search={searchQuery} />
      <ErrorButton />
    </>
  );
};
