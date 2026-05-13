import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    root: process.cwd(),
    globals: true,
    setupFiles: './src/test-utils/setupTests.ts',

    coverage: {
      reporter: ['text', 'html'],

      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/index.{js,jsx,ts,tsx}',
        'src/test-utils/setupTests.{js,ts}',
        'src/**/*.d.ts',
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
