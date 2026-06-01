import { describe, it, expect } from 'vitest';
import {
  useGetListQuery,
  useSearchQuery,
  useGetDetailQuery,
  useDownloadMutation,
} from './api-endpoints';

describe('apiEndpoints exports', () => {
  it('should export useGetListQuery', () => {
    expect(useGetListQuery).toBeDefined();
    expect(typeof useGetListQuery).toBe('function');
  });

  it('should export useSearchQuery', () => {
    expect(useSearchQuery).toBeDefined();
    expect(typeof useSearchQuery).toBe('function');
  });

  it('should export useGetDetailQuery', () => {
    expect(useGetDetailQuery).toBeDefined();
    expect(typeof useGetDetailQuery).toBe('function');
  });

  it('should export useDownloadMutation', () => {
    expect(useDownloadMutation).toBeDefined();
    expect(typeof useDownloadMutation).toBe('function');
  });
});
