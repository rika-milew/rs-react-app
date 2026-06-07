import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFormDataStore } from './use-form-data-store';
import {
  mockUUID,
  mockTimestamp,
  mockFormData1,
  mockFormData2,
  mockFormData3,
} from '@/test-utils/form-data.mock';

vi.stubGlobal('crypto', {
  randomUUID: () => mockUUID,
});

describe('useFormDataStore', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
    useFormDataStore.setState({ submissions: [] });
  });

  it('initializes with empty submissions array', () => {
    const { submissions } = useFormDataStore.getState();

    expect(submissions).toEqual([]);
    expect(submissions).toHaveLength(0);
  });

  it('saves submission with generated id and createdAt', () => {
    useFormDataStore.getState().saveSubmission(mockFormData1);

    const { submissions } = useFormDataStore.getState();

    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toEqual({
      ...mockFormData1,
      id: mockUUID,
      createdAt: mockTimestamp,
    });
  });

  it('adds new submissions to the beginning of array', () => {
    useFormDataStore.getState().saveSubmission(mockFormData2);
    useFormDataStore.getState().saveSubmission(mockFormData3);

    const { submissions } = useFormDataStore.getState();

    expect(submissions).toHaveLength(2);
    expect(submissions[0].name).toBe('Kate');
    expect(submissions[1].name).toBe('Svyatoslav');
  });

  it('handles multiple submissions with unique ids', () => {
    useFormDataStore.getState().saveSubmission(mockFormData2);
    useFormDataStore.getState().saveSubmission(mockFormData3);

    const { submissions } = useFormDataStore.getState();

    expect(submissions).toHaveLength(2);
    expect(submissions[0].id).toBe(mockUUID);
    expect(submissions[1].id).toBe(mockUUID);
  });
});
