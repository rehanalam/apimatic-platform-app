import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspaces/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='bg-red-50'>
      <div>Hello "/workspaces/_layout"!</div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
