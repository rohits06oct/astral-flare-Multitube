const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:8000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        headless: process.env.HEADLESS === 'false' ? false : true,
        launchOptions: {
            slowMo: 500,
        },
    },

    projects: [
        {
            name: 'desktop-chrome',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile-pixel',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'mobile-iphone',
            use: { ...devices['iPhone 12'] },
        },
    ],

    // Run local dev server before starting the tests
    webServer: {
        command: 'npx -y serve .. -p 8000',
        url: 'http://localhost:8000',
        reuseExistingServer: !process.env.CI,
        cwd: __dirname,
    },
});
