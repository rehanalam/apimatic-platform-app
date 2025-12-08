import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      // Prevent importing server-only modules in the browser
      '@apimatic/api/server-functions': '/dev-null',
    },
  },
  optimizeDeps: {
    exclude: ['@prisma/client', '@apimatic/db'],
  },
})
