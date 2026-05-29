import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadCSV } from './download-csv';
import { mockItemFull, mockItemPartial } from '@/test-utils/api-mock';

describe('downloadCSV', () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.spyOn(globalThis, 'Blob').mockImplementation(
      function (content, options) {
        return { content, options };
      },
    );

    globalThis.URL.createObjectURL = vi.fn(() => 'blob:url');
    globalThis.URL.revokeObjectURL = vi.fn();

    const linkClick = vi.fn<() => void>();
    const linkRemove = vi.fn<() => void>();

    const mockLink = Object.assign(document.createElement('a'), {
      click: linkClick,
      remove: linkRemove,
    });

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    vi.spyOn(document.body, 'append').mockImplementation(() => undefined);

    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
  });

  it('does not download file when array is empty', () => {
    downloadCSV([]);
    expect(createObjectURLSpy).not.toHaveBeenCalled();
  });

  it('creates CSV for single item correctly', () => {
    downloadCSV([mockItemFull]);

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url');
  });

  it('creates CSV for multiple items correctly', () => {
    downloadCSV([mockItemFull, mockItemPartial]);

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url');
  });
});
