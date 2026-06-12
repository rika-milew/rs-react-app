import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './modal';

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (element: ReactNode) => element,
  };
});

vi.mock('./modal-content/modal-content', () => ({
  ModalContent: vi.fn(
    ({ onClose, children }: { onClose: () => void; children: ReactNode }) => (
      <div data-testid="modal-content">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ),
  ),
}));

describe('Modal', () => {
  it('returns null when not visible', () => {
    const { container } = render(
      <Modal isVisible={false} onClose={vi.fn()}>
        <p>Modal Content</p>
      </Modal>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when visible', () => {
    render(
      <Modal isVisible onClose={vi.fn()}>
        <p>Modal Content</p>
      </Modal>,
    );

    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal isVisible onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    await user.click(screen.getByText('Close'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isVisible becomes false', () => {
    const { container, rerender } = render(
      <Modal isVisible onClose={vi.fn()}>
        <p>Modal Content</p>
      </Modal>,
    );

    expect(screen.getByTestId('modal-content')).toBeInTheDocument();

    rerender(
      <Modal isVisible={false} onClose={vi.fn()}>
        <p>Modal Content</p>
      </Modal>,
    );

    expect(container.firstChild).toBeNull();
  });
});
