import { createFileRoute } from '@tanstack/react-router';
import { DetailView } from '@/components/detail-view/detail-view';

export const Route = createFileRoute('/_layout/details/$detailId')({
  component: DetailViewRoute,
});

function DetailViewRoute() {
  const { detailId } = Route.useParams();
  return <DetailView key={detailId} detailId={detailId} />;
}
