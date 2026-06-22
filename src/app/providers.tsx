'use client';

import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { store } from '@/store';
import { ThemeProvider } from '@/theme-context/theme-provider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
