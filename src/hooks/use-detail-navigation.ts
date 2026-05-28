import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/constants/constants';

type UseDetailNavigation = {
  openDetailView: (id: number) => void;
  closeDetailView: () => void;
};

export function useDetailNavigation(): UseDetailNavigation {
  const navigate = useNavigate();

  const openDetailView = (id: number): void => {
    void navigate({
      to: ROUTES.DETAIL,
      params: { detailId: String(id) },
    });
  };

  const closeDetailView = (): void => {
    void navigate({
      to: '/',
    });
  };

  return { openDetailView, closeDetailView };
}
