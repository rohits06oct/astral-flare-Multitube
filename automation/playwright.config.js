const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'https://youtubemulti.online/',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        headless: false,
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
            name: 'desktop-firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'mobile-iphone',
            use: { ...devices['iPhone 12'] },
        },
    ],

});
