import { createFileRoute } from '@tanstack/react-router';
import { LayoutRoute } from './-_layout-component';

export const Route = createFileRoute('/_layout')({
  component: LayoutRoute,
});
