import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '@/pages/about-page';
import { ROUTES } from '@/constants/constants';

export const Route = createFileRoute(ROUTES.ABOUT)({
  component: AboutPage,
});
