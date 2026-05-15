import { createFileRoute } from '@tanstack/react-router';
import { DetailView } from '@/components/detail-view/detail-view';

export const Route = createFileRoute('/details/$detailId')({
  component: DetailView,
});
