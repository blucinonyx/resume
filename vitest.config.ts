import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

// Lightweight test runner config — reads source from `src/`, no Vue
// component rendering (we test pure services + value objects only per
// `feedback_test_philosophy`).
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
});
