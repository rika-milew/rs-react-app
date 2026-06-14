import classNames from 'classnames/bind';
import { useEffect, useCallback } from 'react';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { API_STATUS, ROUTES } from '@/constants/constants';
import { ErrorState } from '@/components/error-state/error-state';
import { Button } from '@/components/button/button';
import styles from './detail-view.module.css';
import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  apiEndpoints,
  useGetDetailQuery,
  useGetListQuery,
} from '@/store/api/api-endpoints';
import type { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { getErrorMessage } from '@/utils/error-handlers';

const cx = classNames.bind(styles);

type DetailViewProps = {
  detailId: string;
};

export function DetailView({ detailId }: DetailViewProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const search = useSearch({ from: ROUTES.LAYOUT });
  const currentPage = search.page ?? 1;

  const { data: cachedItem } = useGetListQuery(
    { search: '', page: currentPage - 1 },
    {
      skip: false,
      selectFromResult: (result) => ({
        data:
          result.data?.status === API_STATUS.SUCCESS
            ? result.data.data.find((item) => String(item.id) === detailId)
            : null,
      }),
    },
  );

  const {
    data: result,
    isLoading,
    isFetching,
    error,
  } = useGetDetailQuery(detailId, { skip: !!cachedItem });

  const handleRefresh = useCallback(() => {
    if (cachedItem) {
      dispatch(apiEndpoints.util.invalidateTags(['List']));
    } else {
      dispatch(
        apiEndpoints.util.invalidateTags([{ type: 'Detail', id: detailId }]),
      );
    }
  }, [detailId, dispatch, cachedItem]);

  const closeDetailView = useCallback(() => {
    void navigate({
      to: '/',
      search,
    });
  }, [navigate, search]);

  useEffect(() => {
    const handleKeyDown = (event_: KeyboardEvent) => {
      if (event_.key === 'Escape') {
        closeDetailView();
      }
    };

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (target.closest('[data-detail]') || target.closest('[data-card]')) {
        return;
      }

      closeDetailView();
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleOutsideClick);
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [closeDetailView]);

  const item =
    cachedItem ?? (result?.status === API_STATUS.SUCCESS ? result.data : null);
  const showLoader = !cachedItem && isLoading;

  if (showLoader) {
    return (
      <DetailLayout closeDetailView={closeDetailView}>
        <div className={cx('loader-overlay')}>
          <Loader />
        </div>
      </DetailLayout>
    );
  }

  if (!item) {
    return (
      <DetailLayout closeDetailView={closeDetailView}>
        <ErrorState
          message={getErrorMessage(error, result?.status)}
          onReload={handleRefresh}
        />
      </DetailLayout>
    );
  }

  return (
    <DetailLayout closeDetailView={closeDetailView}>
      <Card item={item} variant="detailed" />
      <Button
        onClick={handleRefresh}
        text={isFetching ? 'Updating...' : 'Refresh'}
        disabled={isFetching}
        className="refresh-button"
      />
    </DetailLayout>
  );
}

function DetailLayout({
  closeDetailView,
  children,
}: {
  closeDetailView: () => void;
  children: ReactNode;
}) {
  return (
    <aside data-detail className={cx('detail-view')}>
      <div className={cx('header')}>
        <h2 className={cx('title')}>Pokémon Details</h2>
        <button
          className={cx('close-button')}
          onClick={closeDetailView}
          aria-label="Close details"
        >
          ✕
        </button>
      </div>
      {children}
    </aside>
  );
}
