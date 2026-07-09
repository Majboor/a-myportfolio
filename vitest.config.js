import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Unit / component test runner config. Kept separate from vite.config.js so the
// production build stays lean and free of test-only settings.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    // e2e specs are driven by Playwright, not Vitest.
    include: ['tests/unit/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx'],
    },
  },
})
