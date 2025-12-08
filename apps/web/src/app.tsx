import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import type { ReactNode } from 'react'
import './styles/globals.css'

export function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta charSet="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>APIMatic SDK Publisher</title>
      </Head>
      <Body>
        {children}
        <Scripts />
        <TanStackRouterDevtools position="bottom-right" />
      </Body>
    </Html>
  )
}
