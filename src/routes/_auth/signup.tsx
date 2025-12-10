import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '@/client/components/auth/signup'

export const Route = createFileRoute('/_auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignupForm />
}
