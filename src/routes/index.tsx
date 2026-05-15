import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SearchPage } from '@/pages/search-page';
import classNames from 'classnames/bind';
import styles from '@/pages/search-page.module.css';

const cx = classNames.bind(styles);

export const Route = createFileRoute('/')({
  component: IndexRoute,
});

function IndexRoute() {
  const isDetailViewOpen = globalThis.location.pathname.includes('/details/');

  return (
    <div className={cx('layout')}>
      <div className={cx('left', { split: isDetailViewOpen })}>
        <SearchPage />
      </div>
      <div className={cx('right', { open: isDetailViewOpen })}>
        <Outlet />
      </div>
    </div>
  );
}
