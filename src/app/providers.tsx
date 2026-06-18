'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/theme-context/theme-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
