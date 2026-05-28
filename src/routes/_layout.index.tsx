import { createFileRoute } from '@tanstack/react-router';

type SearchParams = {
  page?: number;
};

export const Route = createFileRoute('/_layout/')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const page = Number(search.page);
    return {
      page: Number.isFinite(page) && page > 0 ? page : 1,
    };
  },
  component: () => null,
});
