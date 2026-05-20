import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDetailNavigation } from '@/hooks/use-detail-navigation';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { StateView } from '@/components/state-view/state-view';
import { API_STATUS, ERROR_MESSAGES } from '@/constants/constants';
import styles from './detail-view.module.css';
import type { DetailResult } from '@/services/detail-service';
import { getDetailData } from '@/services/detail-service';

const cx = classNames.bind(styles);

type DetailViewProps = {
  detailId: string;
};

type ViewState = { type: typeof API_STATUS.LOADING } | DetailResult;

export function DetailView({ detailId }: DetailViewProps) {
  const [result, setResult] = useState<ViewState>({ type: API_STATUS.LOADING });
  const { closeDetailView } = useDetailNavigation();

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
  }, [detailId]);

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

  if (result.type === API_STATUS.NOT_FOUND) {
    return (
      <StateView
        message={ERROR_MESSAGES.NOTFOUND}
        onReload={() => {
          globalThis.location.reload();
        }}
      />
    );
  }

  if (result.type === API_STATUS.ERROR) {
    return (
      <StateView
        message={result.message}
        onReload={() => {
          globalThis.location.reload();
        }}
      />
    );
  }

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
      {result.type === API_STATUS.LOADING ? (
        <div className={cx('loader-overlay')}>
          <Loader />
        </div>
      ) : (
        <Card item={result.data} variant="detailed" />
      )}
    </aside>
  );
}
