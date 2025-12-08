// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import tailwindcss from "@tailwindcss/vite";
var app_config_default = defineConfig({
  server: {
    preset: "node-server"
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src"
      }
    },
    ssr: {
      noExternal: ["@apimatic/ui", "@apimatic/auth-routes"],
      external: ["@prisma/client"]
    }
  }
});
export {
  app_config_default as default
};
