import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: lazyRouteComponent(() => import('@apimatic/auth-routes/signup')),
})
