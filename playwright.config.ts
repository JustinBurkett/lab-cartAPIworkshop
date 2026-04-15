import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'dotnet run --project backend/BuckeyeMarketplace.csproj',
      url: 'http://localhost:5000/api/products',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -- --host localhost --port 5173',
      url: 'http://localhost:5173',
      cwd: 'frontend',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
