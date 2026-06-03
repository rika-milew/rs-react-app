import classNames from 'classnames/bind';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import styles from './modal.module.css';

const cx = classNames.bind(styles);

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isVisible, onClose, children }: ModalProps) {
  const modalRoot =
    typeof document === 'undefined'
      ? null
      : document.getElementById('modal-root');

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);

    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    closeButtonRef.current?.focus();
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div className={cx('overlay')} onClick={onClose}>
      <div
        className={cx('modal')}
        role="dialog"
        aria-modal="true"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={cx('close-button')}
          onClick={onClose}
        >
          ✕
        </button>
        <h2>React Form</h2>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}
