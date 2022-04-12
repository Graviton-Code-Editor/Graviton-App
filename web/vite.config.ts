import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

export default defineConfig(() => ({
  server: {
    port: 8080,
  },
  clearScreen: false,
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
      },
    }),
  ],
  test: {
    global: true,
    environment: "happy-dom",
    deps: {
      inline: ["recoil"],
    },
  },
}));
