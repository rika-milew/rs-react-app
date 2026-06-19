'use client';

import { useState } from 'react';
import { Button } from '@/components/button/button';

export function ErrorButton() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error('Test error triggered');
  }

  return (
    <Button
      text="Trigger error"
      variant="error"
      onClick={() => {
        setHasError(true);
      }}
    />
  );
}
