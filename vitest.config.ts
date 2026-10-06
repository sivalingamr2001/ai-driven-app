import { defineConfig } from "vitest/config"
import viteReact from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  plugins: [viteReact()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "src/components/dynamicGrid/**",
      "src/hooks/dynamic-grid/**",
      "src/lib/dynamic-grid/**",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
