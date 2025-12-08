import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@apimatic/ui'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">APIMatic SDK Publisher</h1>
        <p className="text-muted-foreground">
          Monorepo with lazy-loaded routes
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/signup">Sign Up</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
