const { test } = require('@playwright/test');

// Run the test multiple times
for (let i = 1; i <= 10; i++) {
    test(`Stealth Browser Test - Iteration ${i}`, async ({ browser }) => {

        // Create a new context with the requested settings
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
            viewport: { width: 1366, height: 768 },
            locale: 'en-US',
            timezoneId: 'Asia/Kolkata',
            geolocation: { latitude: 28.5328, longitude: 77.2606 },
            permissions: ['geolocation']
        });

        // Create a new page in the context
        const page = await context.newPage();
        //console.log(`[Iteration ${i}] Navigating to https://ziply.pk/youtubemulti...`);

        // Open the URL
        await page.goto('https://ziply.pk/youtubemulti');

        // Wait for 15 seconds as requested
        //console.log(`[Iteration ${i}] Waiting for 15 seconds...`);
        await page.waitForTimeout(10000);

        // Click or scroll
        //console.log(`[Iteration ${i}] Scrolling page...`);
        // await page.evaluate(() => {
        //     window.scrollBy(0, 500);
        // });

        // Wait a bit more to see the result
        await page.waitForTimeout(2000);

        //console.log(`[Iteration ${i}] Test completed.`);

        // Close context
        await context.close();
    });
}
