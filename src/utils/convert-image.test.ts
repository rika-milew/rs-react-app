import { describe, it, expect, vi } from 'vitest';
import { convertImage } from './convert-image';

describe('convertImage', () => {
  it('converts file to base64 string', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = await convertImage(file);

    expect(typeof result).toBe('string');
    expect(result).toContain('data:image/png;base64,');
  });

  it('rejects with error when FileReader fails', async () => {
    const file = new File([''], '');
    const error = new Error('Read error');

    vi.spyOn(globalThis, 'FileReader').mockImplementation(function (
      this: FileReader,
    ) {
      Object.defineProperty(this, 'error', {
        value: error,
        writable: true,
        configurable: true,
      });

      this.readAsDataURL = vi.fn();
      this.addEventListener = vi.fn(
        (event: string, handler: EventListenerOrEventListenerObject) => {
          if (event === 'error' && typeof handler === 'function') {
            setTimeout(() => handler(new Event('error')), 0);
          }
        },
      );
      return this;
    });

    await expect(convertImage(file)).rejects.toThrow('Read error');

    vi.restoreAllMocks();
  });

  it('rejects when result is not a string', async () => {
    const file = new File([''], '');

    vi.spyOn(globalThis, 'FileReader').mockImplementation(function (
      this: FileReader,
    ) {
      Object.defineProperty(this, 'result', {
        value: new ArrayBuffer(0),
        writable: true,
        configurable: true,
      });

      this.readAsDataURL = vi.fn();
      this.addEventListener = vi.fn(
        (event: string, handler: EventListenerOrEventListenerObject) => {
          if (event === 'load' && typeof handler === 'function') {
            setTimeout(() => handler(new Event('load')), 0);
          }
        },
      );
      return this;
    });

    await expect(convertImage(file)).rejects.toThrow(
      'Failed to convert image to base64',
    );

    vi.restoreAllMocks();
  });
});
