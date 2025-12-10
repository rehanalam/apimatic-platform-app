import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspaces/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workspaces/create"!</div>
}
