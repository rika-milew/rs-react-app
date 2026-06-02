import classNames from 'classnames/bind';
import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { API_STATUS, ERROR_MESSAGES, ROUTES } from '@/constants/constants';
import { ErrorState } from '@/components/error-state/error-state';
import styles from './detail-view.module.css';
import type { DetailResult } from '@/services/detail-service';
import { getDetailData } from '@/services/detail-service';
import { useNavigate, useSearch } from '@tanstack/react-router';

const cx = classNames.bind(styles);

type DetailViewProps = {
  detailId: string;
};

type ViewState = { status: typeof API_STATUS.LOADING } | DetailResult;

function renderErrorState(message: string, onReload: () => void) {
  return <ErrorState message={message} onReload={onReload} />;
}

export function DetailView({ detailId }: DetailViewProps) {
  const [result, setResult] = useState<ViewState>({
    status: API_STATUS.LOADING,
  });
  const [refetch, setRefetch] = useState(0);
  const navigate = useNavigate();
  const search = useSearch({ from: ROUTES.LAYOUT });

  const closeDetailView = useCallback(() => {
    void navigate({
      to: '/',
      search,
    });
  }, [navigate, search]);

  useEffect(() => {
    let cancelled = false;

    void getDetailData(detailId).then((data) => {
      if (!cancelled) {
        setResult(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [detailId, refetch]);

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

  const handleReload = useCallback(() => {
    setRefetch((previous) => previous + 1);
  }, []);

  if (
    result.status === API_STATUS.NOT_FOUND ||
    result.status === API_STATUS.ERROR
  ) {
    return (
      <aside data-detail className={cx('detail-view')}>
        {renderErrorState(getErrorMessage(result), handleReload)}
      </aside>
    );
  }
  return (
    <aside data-detail className={cx('detail-view')}>
      <DetailHeader onClose={closeDetailView} />
      {result.status === API_STATUS.LOADING ? (
        <div className={cx('loader-overlay')}>
          <Loader />
        </div>
      ) : (
        <Card item={result.data} variant="detailed" />
      )}
    </aside>
  );
}

function DetailHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className={cx('header')}>
      <h2 className={cx('title')}>Pokémon Details</h2>
      <button
        className={cx('close-button')}
        onClick={onClose}
        aria-label="Close details"
      >
        ✕
      </button>
    </div>
  );
}

function getErrorMessage(result: ViewState): string {
  if (result.status === API_STATUS.NOT_FOUND) {
    return ERROR_MESSAGES.NOTFOUND;
  }
  if (result.status === API_STATUS.ERROR) {
    return result.message;
  }
  return ERROR_MESSAGES.DEFAULT;
}
