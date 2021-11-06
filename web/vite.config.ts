import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { EsLinter, linterPlugin, TypeScriptLinter } from 'vite-plugin-linter';

export default defineConfig((configEnv) => ({
  plugins: [react(), linterPlugin({
    include: ["./src/**/*.ts", "./src/**/*.tsx"],
    linters: [new EsLinter({ configEnv: configEnv }), new TypeScriptLinter()],
  }),]
}));
