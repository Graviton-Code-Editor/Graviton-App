import { defineConfig } from 'vite'
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";
import path from 'path'

export default defineConfig((configEnv) => ({
  clearScreen: false,
  plugins:[
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
      },
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@gveditor/web_components',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'styled-components'],
      output: {},
    }
  }
}));
