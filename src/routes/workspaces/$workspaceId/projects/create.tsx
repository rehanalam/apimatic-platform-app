import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/workspaces/$workspaceId/projects/create',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workspaces/$workspaceId/projects/create"!</div>
}
