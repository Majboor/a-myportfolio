import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA build -> dist (matches the Cloudflare Pages build config)
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2019',
    // esbuild minify (Vite default) + CSS minify keep the payload small.
    cssMinify: true,
    // Split the React runtime into its own hashed chunk so it stays cached
    // across content-only redeploys instead of being invalidated with the app.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
})
