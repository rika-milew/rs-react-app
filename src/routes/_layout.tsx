import classNames from 'classnames/bind';
import {
  createFileRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { SearchPage } from '@/pages/search/search-page';
import { ROUTES } from '@/constants/constants';
import styles from '@/pages/search/search-page.module.css';

const cx = classNames.bind(styles);

export const Route = createFileRoute('/_layout')({
  component: LayoutRoute,
});

function LayoutRoute() {
  const matches = useRouterState({
    select: (state) => state.matches,
  });
  const isDetailViewOpen = matches.some(
    (match) => match.routeId === `${ROUTES.LAYOUT}${ROUTES.DETAIL}`
  );

  return (
    <div className={cx('home-page-layout')}>
      <div className={cx('search-section', { split: isDetailViewOpen })}>
        <SearchPage />
      </div>
      <div className={cx('detail-section', { open: isDetailViewOpen })}>
        <Outlet />
      </div>
    </div>
  );
}
