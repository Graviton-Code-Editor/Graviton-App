import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactSvgPlugin  from 'vite-plugin-react-svg'
import checker from 'vite-plugin-checker'

export default defineConfig((configEnv) => ({
  server: {
    port: 8080
  },
  clearScreen: false,
  plugins: [
    react(),
    reactSvgPlugin(),
    checker({
      typescript: true,
      eslint: {
        files: ['./src'],
        extensions: ['.ts'],
      },
    })
  ]
}));
