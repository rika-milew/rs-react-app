'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/button/button';

export function ErrorButton() {
  const t = useTranslations('Home');

  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error('Test error triggered');
  }

  return (
    <Button
      text={t('triggerError')}
      variant="error"
      onClick={() => {
        setHasError(true);
      }}
    />
  );
}
