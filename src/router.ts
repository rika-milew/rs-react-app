import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { NotFoundPage } from '@/pages/not-found/not-found';
import { ErrorBoundaryAdapter } from './components/error-boundary/error-boundary-adapter';

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorBoundaryAdapter,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
