import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => ({
  resolve: {
    alias: {
      events: "rollup-plugin-node-polyfills/polyfills/events",
      path: "rollup-plugin-node-polyfills/polyfills/path",
    },
  },
  server: {
    port: 8080,
  },
  clearScreen: false,
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
    tsconfigPaths()
  ],
  test: {
    global: true,
    environment: "happy-dom",
    deps: {
      inline: ["recoil"],
    },
  },
}));
