import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ModalContent } from './modal-content';

describe('ModalContent', () => {
  it('renders modal with title and close button correctly', () => {
    render(
      <ModalContent onClose={vi.fn()}>
        <p>Content</p>
      </ModalContent>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('React Form')).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <ModalContent onClose={handleClose}>
        <p>Modal Content</p>
      </ModalContent>,
    );

    await user.click(screen.getByText('✕'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key press', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <ModalContent onClose={handleClose}>
        <p>Modal Content</p>
      </ModalContent>,
    );

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <ModalContent onClose={handleClose}>
        <p>Modal Content</p>
      </ModalContent>,
    );

    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement;

    if (!overlay) {
      throw new Error('Overlay not found');
    }

    await user.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <ModalContent onClose={handleClose}>
        <p>Modal Content</p>
      </ModalContent>,
    );

    await user.click(screen.getByText('Modal Content'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(globalThis, 'removeEventListener');

    const { unmount } = render(
      <ModalContent onClose={vi.fn()}>
        <p>Modal Content</p>
      </ModalContent>,
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
