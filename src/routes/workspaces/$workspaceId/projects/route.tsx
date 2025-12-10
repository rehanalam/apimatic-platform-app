import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspaces/$workspaceId/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workspaces/$workspaceId/projects layout"! 
    <div><Outlet/></div>
  </div>
}
