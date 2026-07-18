import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA build -> dist (matches the Cloudflare Pages build config)
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2019',
  },
})
