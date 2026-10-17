import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end checks against the production build (`vite preview`). Run with `npm run test:e2e`
 * after `npm run build`. Headless Chromium renders WebGL with SwiftShader.
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] },
  },
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    // Cross-browser runs (`npm run test:e2e:browsers`): Firefox on desktop.
    ...(process.env.E2E_ALL_BROWSERS
      ? [{ name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 }, launchOptions: {} } }]
      : []),
  ],
})
