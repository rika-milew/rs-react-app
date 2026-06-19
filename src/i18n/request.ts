import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = new Set<string>(['en', 'be']);

type Messages = Record<string, Record<string, string>>;

async function importMessages(locale: string): Promise<Messages> {
  const module: { default: Messages } = await import(
    `./messages/${locale}.json`
  );
  return module.default;
}

export default getRequestConfig(async ({ locale = 'en' }) => {
  if (!locales.has(locale)) {
    notFound();
  }

  const messages = await importMessages(locale);

  return {
    locale,
    messages,
  };
});
