import { Outlet } from '@tanstack/react-router';
import { Layout } from '@/components/layout/layout';

export const RootLayout = () => (
  <>
    <Layout>
      <Outlet />
    </Layout>
  </>
);
