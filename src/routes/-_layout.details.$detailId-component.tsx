import { DetailView } from '@/components/detail-view/detail-view';
import { Route } from './_layout.details.$detailId';

export function DetailViewRoute() {
  const { detailId } = Route.useParams();
  return <DetailView key={detailId} detailId={detailId} />;
}
