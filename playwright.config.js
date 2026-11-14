// This file has been created (totally or partially) with the assistance of artificial intelligence tools.
// All content has been generated under the direct supervision of a named individual,
// and under the AI.Backbone Orchestrator Compliance framework

import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  workers: 2,
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4179',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4179',
    cwd: fileURLToPath(new URL('.', import.meta.url)),
    url: 'http://127.0.0.1:4179',
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
