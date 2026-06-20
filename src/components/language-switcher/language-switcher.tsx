'use client';

import { useLocale } from '@/contexts/locale-provider';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div>
      <button onClick={() => setLocale('en')} disabled={locale === 'en'}>
        EN
      </button>
      <button onClick={() => setLocale('be')} disabled={locale === 'be'}>
        BE
      </button>
    </div>
  );
}
