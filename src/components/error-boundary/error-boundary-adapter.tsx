import { ErrorBoundary } from '@/components/error-boundary/error-boundary';

export function ErrorBoundaryAdapter({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorBoundary error={error} reset={reset} layout={false} />;
}
