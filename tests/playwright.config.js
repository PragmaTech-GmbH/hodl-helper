const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    timezoneId: 'Europe/Berlin',
    trace: 'retain-on-failure',
  },
  projects: [
    // Phone-sized, as the page is used on an iPhone; Chromium keeps the CI install small.
    { name: 'iphone', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
  // The page is static: serve the repository root as Netlify does.
  webServer: {
    command: 'python3 -m http.server 4173 --directory ..',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
