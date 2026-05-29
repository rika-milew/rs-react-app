import { createFileRoute } from '@tanstack/react-router';
import { DetailViewRoute } from './-_layout.details.$detailId-component';

export const Route = createFileRoute('/_layout/details/$detailId')({
  component: DetailViewRoute,
});
