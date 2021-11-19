import { defineConfig } from 'vite'
import typescript from '@rollup/plugin-typescript'
import path from 'path'

export default defineConfig((configEnv) => ({
  clearScreen: false,
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@gveditor/web_components',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'styled-components'],
      output: {},
      plugins: [
        typescript({ tsconfig: './tsconfig.json' })
      ]
    }
  }
}));
