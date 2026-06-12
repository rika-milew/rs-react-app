import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ModalContent } from './modal-content/modal-content';

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isVisible, onClose, children }: ModalProps) {
  if (!isVisible) {
    return null;
  }

  return createPortal(
    <ModalContent onClose={onClose}>{children}</ModalContent>,
    document.body,
  );
}
