import {
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '../client/lib/devtools'
import '../styles.css'
import type { ErrorComponentProps } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Button, Heading, Text } from '@/client/components/ui'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
  }),
  errorComponent: RootError,
  notFoundComponent: RootNotFound,
  shellComponent: RootDocument,
})

function RootError({ error, reset }: ErrorComponentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <Heading level={1}>Oops! Something went wrong</Heading>
        <Text>{error.message}</Text>

        {import.meta.env.DEV && (
          <pre className="text-xs bg-red-50 p-4 rounded overflow-auto mb-4">
            {error.stack}
          </pre>
        )}

        <div className="flex gap-3">
          <Button onClick={() => reset()}>Try Again</Button>
          <Link
            to="/"
            className="px-4 py-2 border border-red-600 text-red-600 rounded"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

// Global 404 Component
function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <Heading level={1}>404</Heading>
        <Heading level={2}>Page Not Found</Heading>
        <Text>The page you're looking for doesn't exist.</Text>

        <div className="flex flex-col gap-3">
          <Button>Go to Homepage</Button>
          <Button variant="secondary">Go Back</Button>
        </div>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* head goes herer */}</head>
      <body>
        {/* <Header /> */}
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
