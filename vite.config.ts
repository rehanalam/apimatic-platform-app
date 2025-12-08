import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

const config = defineConfig(({ mode }) => ({
  plugins: [
    devtools(),
    // Disable Cloudflare plugin in development since Prisma requires Node.js runtime
    ...(mode !== 'development'
      ? [
          cloudflare({
            viteEnvironment: { name: 'ssr' },
            enableRuntimeCompatibilityCheck: false,
            persist: { path: '.wrangler/state' },
            compatibilityFlags: ['nodejs_compat'],
          }),
        ]
      : []),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  resolve: {
    alias: {
      '.prisma/client': './src/generated/prisma',
    },
  },
}))

export default config
