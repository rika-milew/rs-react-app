import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Layout } from '@/components/layout/layout';

export const RootLayout = () => (
  <>
    <Layout>
      <Outlet />
    </Layout>
    <TanStackRouterDevtools />
  </>
);
