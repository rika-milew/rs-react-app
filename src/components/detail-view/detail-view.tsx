import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { useEffect, useCallback } from 'react';
import { Card } from '@/components/card/card';
import { Loader } from '@/components/loader/loader';
import { API_STATUS } from '@/constants/constants';
import { ErrorState } from '@/components/error-state/error-state';
import styles from './detail-view.module.css';
import { useSearchParams } from 'next/navigation';
import { useGetDetailQuery, useGetListQuery } from '@/store/api/api-endpoints';
import type { ReactNode } from 'react';
import { getErrorMessage } from '@/utils/error-handlers';

const cx = classNames.bind(styles);

type DetailViewProps = {
  detailId: string;
  onClose: () => void;
};

export function DetailView({ detailId, onClose }: DetailViewProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: cachedItem, refetch: refetchList } = useGetListQuery(
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
    error,
    refetch: refetchDetail,
  } = useGetDetailQuery(detailId, { skip: !!cachedItem });

  const handleRefresh = useCallback(() => {
    if (cachedItem) {
      void refetchList();
    } else {
      void refetchDetail();
    }
  }, [cachedItem, refetchList, refetchDetail]);

  const closeDetailView = useCallback(() => {
    onClose();
  }, [onClose]);

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
      if (
        target.closest('[data-detail]') ||
        target.closest('[data-card]') ||
        target.closest('[data-pagination]')
      ) {
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
      <Card key={detailId} item={item} variant="detailed" />
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
  const t = useTranslations('Details');
  return (
    <aside data-detail className={cx('detail-view')}>
      <div className={cx('header')}>
        <h2 className={cx('title')}>{t('title')}</h2>
        <button
          className={cx('close-button')}
          onClick={closeDetailView}
          aria-label={t('close')}
        >
          ✕
        </button>
      </div>
      {children}
    </aside>
  );
}
