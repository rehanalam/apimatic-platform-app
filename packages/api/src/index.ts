// Server functions (use only in server context with TanStack Start)
export * from './server-functions/auth'
export * from './server-functions/projects'

// Client functions (safe to use in browser)
export * as clientAuth from './client/auth'
