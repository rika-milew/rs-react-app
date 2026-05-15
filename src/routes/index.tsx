import { createFileRoute } from '@tanstack/react-router';
import { ROUTES } from '@/constants/constants';
import { SearchPage } from '@/pages/search-page';

export const Route = createFileRoute(ROUTES.HOME)({
  component: SearchPage,
});
