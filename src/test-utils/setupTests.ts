import '@testing-library/jest-dom';
import { afterEach, beforeEach, vi } from 'vitest';
import type { ReactElement, ReactNode } from 'react';
import { createElement } from 'react';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');

  return {
    ...actual,
    Link: ({ children }: { children: ReactNode }): ReactElement =>
      createElement('a', null, children),
  };
});

beforeEach(() => {
  localStorage.clear();

  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);

  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
