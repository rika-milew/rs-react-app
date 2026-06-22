import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'be'],
  defaultLocale: 'en',
  localePrefix: 'never',
});
