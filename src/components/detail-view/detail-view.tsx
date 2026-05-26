import classNames from 'classnames/bind';
import { useEffect, useCallback } from 'react';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { StateView } from '@/components/state-view/state-view';
import { Button } from '@/components/button/button';
import { API_STATUS, ERROR_MESSAGES, ROUTES } from '@/constants/constants';
import styles from './detail-view.module.css';
import { useNavigate } from '@tanstack/react-router';
import { useGetDetailQuery } from '@/store/api/api-endpoints';

const cx = classNames.bind(styles);

type DetailViewProps = {
  detailId: string;
};

export function DetailView({ detailId }: DetailViewProps) {
  const navigate = useNavigate();
  const { data: result, isLoading, refetch } = useGetDetailQuery(detailId);

  const closeDetailView = useCallback((): void => {
    const parameters = new URLSearchParams(globalThis.location.search);
    const page = Number(parameters.get('page')) || 1;

    void navigate({
      to: ROUTES.HOME,
      search: { page },
    });
  }, [navigate]);

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

  if (isLoading) {
    return (
      <DetailLayout closeDetailView={closeDetailView}>
        <div className={cx('loader-overlay')}>
          <Loader />
        </div>
      </DetailLayout>
    );
  }

  if (result?.type === API_STATUS.NOT_FOUND) {
    return (
      <DetailLayout closeDetailView={closeDetailView}>
        <StateView
          message={ERROR_MESSAGES.NOTFOUND}
          onReload={() => void refetch()}
        />
      </DetailLayout>
    );
  }

  if (result?.type === API_STATUS.ERROR) {
    return (
      <DetailLayout closeDetailView={closeDetailView}>
        <StateView message={result.message} onReload={() => void refetch()} />
      </DetailLayout>
    );
  }

  return (
    <DetailLayout closeDetailView={closeDetailView}>
      {result?.type === API_STATUS.SUCCESS && (
        <Card item={result.data} variant="detailed" />
      )}
      <Button
        onClick={() => void refetch()}
        text="Refresh"
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
  children: React.ReactNode;
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
