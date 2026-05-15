import { useEffect } from 'react';
import { useDetailData } from '@/hooks/use-detail-data';
import { useDetailNavigation } from '@/hooks/use-detail-navigation';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { StateView } from '@/components/state-view/state-view';
import { useParams } from '@tanstack/react-router';
import classNames from 'classnames/bind';
import styles from './detail-view.module.css';
import { API_STATUS } from '@/constants/constants';

const cx = classNames.bind(styles);

export function DetailView() {
  const { detailId } = useParams({ from: '/details/$detailId' });
  const result = useDetailData(detailId);
  const { closeDetailView } = useDetailNavigation();

  useEffect(() => {
    const handleKeyDown = (event_: KeyboardEvent) => {
      if (event_.key === 'Escape') {
        closeDetailView();
      }
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDetailView]);

  if (!result) {
    return null;
  }

  if (result.status === API_STATUS.NOT_FOUND) {
    return (
      <StateView
        message="Pokemon not found"
        onReload={() => {
          globalThis.location.reload();
        }}
      />
    );
  }

  if (result.status === API_STATUS.ERROR) {
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
    <aside className={cx('detail-view')}>
      <div className={cx('header')}>
        <h2 className={cx('title')}>Pokémon Details</h2>
        <button className={cx('close-button')} onClick={closeDetailView}>
          ✕
        </button>
      </div>
      {result.status === API_STATUS.LOADING && <Loader />}
      {result.status === API_STATUS.SUCCESS && <Card item={result.data} />}
    </aside>
  );
}
