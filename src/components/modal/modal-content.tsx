import classNames from 'classnames/bind';
import styles from './modal.module.css';
import type { ReactNode } from 'react';

import { useEffect, useRef } from 'react';

const cx = classNames.bind(styles);

type ModalContentProps = {
  onClose: () => void;
  children: ReactNode;
};

export function ModalContent({ onClose, children }: ModalContentProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);

    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayMouseDown = (event: React.MouseEvent) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      className={cx('overlay')}
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        className={cx('modal')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={cx('modal-header')}>
          <h2 id="modal-title">React Form</h2>
          <button
            ref={closeButtonRef}
            className={cx('close-button')}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
