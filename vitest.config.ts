import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'] // optional, for global setup
  }
})


