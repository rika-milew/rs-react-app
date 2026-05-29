import { useNavigate } from '@tanstack/react-router';
import { CardList } from '@/components/card-list/card-list';
import { SearchBar } from '@/components/search-bar/search-bar';
import { ErrorButton } from '@/components/error-button/error-button';
import { useLocalStorage } from '@/hooks/use-local-storage';

export const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useLocalStorage('search', '');
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    void navigate({
      to: '.',
      search: { page: 1 },
      replace: true,
    });
  };

  return (
    <>
      <SearchBar
        key={searchQuery}
        value={searchQuery}
        onSearch={handleSearch}
      />
      <CardList search={searchQuery} />
      <ErrorButton />
    </>
  );
};
