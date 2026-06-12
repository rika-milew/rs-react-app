import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  base: '/',
  test: {
    environment: 'jsdom',
    root: process.cwd(),
    globals: true,
    setupFiles: './src/test-utils/setup-tests.ts',

    coverage: {
      reporter: ['text', 'html'],

      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/index.{js,jsx,ts,tsx}',
        'src/test-utils/setup-tests.{js,ts}',
        'src/**/*.d.ts',
        'src/main.{js,jsx,ts,tsx}',
      ],

      thresholds: {
        statements: 80,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
});
