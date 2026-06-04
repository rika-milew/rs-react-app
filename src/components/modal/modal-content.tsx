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

  return (
    <div className={cx('overlay')} onClick={onClose}>
      <div
        className={cx('modal')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className={cx('close-button')}
          onClick={onClose}
        >
          ✕
        </button>
        <h2 id="modal-title">React Form</h2>
        {children}
      </div>
    </div>
  );
}
