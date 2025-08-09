import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  css: {
    // Prevent Vitest/Vite from loading project PostCSS/Tailwind config during tests
    postcss: null,
  },
});


