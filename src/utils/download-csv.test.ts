import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadCSV } from './download-csv';
import { mockItemFull, mockItemPartial } from '@/test-utils/api-mock';

describe('downloadCSV', () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();

    vi.spyOn(globalThis, 'Blob').mockImplementation(
      function (content, options) {
        return { content, options };
      },
    );

    createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');

    const linkClick = vi.fn<() => void>();
    const linkRemove = vi.fn<() => void>();

    const mockLink = Object.assign(document.createElement('a'), {
      click: linkClick,
      remove: linkRemove,
    });

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    vi.spyOn(document.body, 'append').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not download file when array is empty', () => {
    downloadCSV([]);
    expect(createObjectURLSpy).not.toHaveBeenCalled();
  });

  it('creates CSV for single item correctly', () => {
    downloadCSV([mockItemFull]);

    expect(createObjectURLSpy).toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url');
  });

  it('creates CSV for multiple items correctly', () => {
    downloadCSV([mockItemFull, mockItemPartial]);

    expect(createObjectURLSpy).toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url');
  });
});
