import { useNavigate, useSearch } from '@tanstack/react-router';
import { ROUTES } from '@/constants/constants';

type UseDetailNavigation = {
  openDetailView: (id: number) => void;
  closeDetailView: () => void;
};

export function useDetailNavigation(): UseDetailNavigation {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_layout' });

  const openDetailView = (id: number): void => {
    void navigate({
      to: ROUTES.DETAIL,
      params: { detailId: String(id) },
      search,
    });
  };

  const closeDetailView = (): void => {
    void navigate({
      to: '/',
      search,
    });
  };

  return { openDetailView, closeDetailView };
}
