import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/workspaces/$workspaceId/projects/$projectId/walkthrough/sdk',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/workspaces/$workspaceId/projects/$projectId/walkthrough/sdk"!
    </div>
  )
}
