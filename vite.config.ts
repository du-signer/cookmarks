import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Relative asset paths so the same build works unmodified whether it's
// served from a domain root (Vercel) or a subpath (GitHub Pages project
// site at /cookmarks/) — index.html and assets/ stay co-located either way.
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? './' : '/',
}))
