import { createApp } from 'vinxi'
import { config } from 'vinxi/plugins/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { serverFunctions } from '@tanstack/start/server-functions'

export default createApp({
  routers: [
    {
      name: 'public',
      mode: 'static',
      dir: './public',
    },
    serverFunctions({
      runtime: 'node',
    }),
    {
      name: 'client',
      mode: 'spa',
      handler: './src/client.tsx',
      target: 'browser',
      plugins: () => [
        config('app-config', {
          resolve: {
            alias: {
              '@': '/src',
            },
          },
          ssr: {
            noExternal: ['@apimatic/ui', '@apimatic/auth-routes'],
          },
        }),
        tailwindcss(),
        react(),
      ],
      base: '/',
    },
    {
      name: 'ssr',
      mode: 'handler',
      handler: './src/server.tsx',
      target: 'server',
      plugins: () => [
        config('app-config', {
          resolve: {
            alias: {
              '@': '/src',
            },
          },
          ssr: {
            noExternal: ['@apimatic/ui', '@apimatic/auth-routes'],
            external: ['@prisma/client'],
          },
        }),
        tailwindcss(),
        react(),
      ],
    },
  ],
})
