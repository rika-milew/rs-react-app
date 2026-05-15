import { useNavigate } from '@tanstack/react-router';

type UseDetailNavigation = {
  openDetailView: (id: number) => void;
  closeDetailView: () => void;
};

export function useDetailNavigation(): UseDetailNavigation {
  const navigate = useNavigate();

  const openDetailView = (id: number): void => {
    const parameters = new URLSearchParams(globalThis.location.search);
    const page = Number(parameters.get('page')) || 1;

    void navigate({
      to: '/details/$detailId',
      params: { detailId: String(id) },
      search: { page },
    });
  };

  const closeDetailView = (): void => {
    const parameters = new URLSearchParams(globalThis.location.search);
    const page = Number(parameters.get('page')) || 1;

    void navigate({
      to: '/',
      search: { page },
    });
  };

  return { openDetailView, closeDetailView };
}
