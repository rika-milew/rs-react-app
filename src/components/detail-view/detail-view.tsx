import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useDetailData } from '@/hooks/use-detail-data';
import { useDetailNavigation } from '@/hooks/use-detail-navigation';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { ErrorState } from '@/components/error-state/error-state';
import { API_STATUS, ERROR_MESSAGES } from '@/constants/constants';
import styles from './detail-view.module.css';

const cx = classNames.bind(styles);

type DetailViewProps = {
  detailId: string;
};

export function DetailView({ detailId }: DetailViewProps) {
  const result = useDetailData(detailId);
  const { closeDetailView } = useDetailNavigation();

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

  if (!result) {
    return null;
  }

  if (result.status === API_STATUS.NOT_FOUND) {
    return (
      <ErrorState
        message={ERROR_MESSAGES.NOTFOUND}
        onReload={() => {
          globalThis.location.reload();
        }}
      />
    );
  }

  if (result.status === API_STATUS.ERROR) {
    return (
      <ErrorState
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
      {result.status === API_STATUS.LOADING && (
        <div className={cx('loader-overlay')}>
          <Loader />
        </div>
      )}
      {result.status === API_STATUS.SUCCESS && (
        <Card item={result.data} variant="detailed" />
      )}
    </aside>
  );
}
