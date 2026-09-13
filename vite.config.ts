import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Served from https://du-signer.github.io/cookmarks/ on GitHub Pages, so
// production asset URLs need that subpath; dev keeps the plain root.
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? '/cookmarks/' : '/',
}))
