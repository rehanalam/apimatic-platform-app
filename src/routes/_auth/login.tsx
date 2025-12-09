import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/client/components/auth/login'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginForm />
}
