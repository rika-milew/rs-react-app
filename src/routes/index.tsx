import { createFileRoute } from '@tanstack/react-router';

import { SearchPage } from '@/pages/search-page';

export const Route = createFileRoute('/')({
  component: SearchPage,
});
