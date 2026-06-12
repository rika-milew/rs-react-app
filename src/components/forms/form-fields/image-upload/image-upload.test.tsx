import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ImageUpload } from './image-upload';

globalThis.URL.createObjectURL = vi.fn(() => 'blob:test');
globalThis.URL.revokeObjectURL = vi.fn();

describe('ImageUpload', () => {
  it('renders file input with correct label', () => {
    render(<ImageUpload name="image" />);

    expect(screen.getByLabelText('Profile Image')).toBeInTheDocument();
  });

  it('calls onChange when file selected', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const file = new File(['test'], 'test-image.png', { type: 'image/png' });

    render(<ImageUpload name="image" onChange={handleChange} />);

    const input = screen.getByLabelText('Profile Image');
    await user.upload(input, file);

    expect(handleChange).toHaveBeenCalledWith(file);
  });

  it('calls onChange with undefined when file removed', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    render(<ImageUpload name="image" onChange={handleChange} />);

    const input = screen.getByLabelText('Profile Image');
    await user.upload(input, file);
    await user.upload(input, []);

    expect(handleChange).toHaveBeenLastCalledWith(undefined);
  });

  it('shows error message when error prop is provided', () => {
    render(<ImageUpload name="image" error="Image error" />);

    expect(screen.getByText('Image error')).toBeInTheDocument();
  });
});
