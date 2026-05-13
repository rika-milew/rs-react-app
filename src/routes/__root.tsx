import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Layout } from '@/components/layout/layout';

const RootLayout = () => (
  <>
    <Layout>
      <Outlet />
    </Layout>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
