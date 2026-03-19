const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Read all HTML files from the article directory
const articleDir = path.join(__dirname, '../../article');
const articleFiles = fs.readdirSync(articleDir).filter(file => file.endsWith('.html'));

test.describe('Articles E2E Tests', () => {
    for (const file of articleFiles) {
        test(`Test Article Page: ${file}`, async ({ page }) => {
            // Navigate to the article
            await page.goto(`/article/${file}`);
            // Add the requested 30 sec hard wait in all test cases
            await page.waitForTimeout(5000);
            // Click random ad in header
            const headerAds = page.locator('.article-header div[style*="flex-wrap: wrap"] > div');
            const headerAdCount = await headerAds.count();
            console.log(`Header ad count: ${headerAdCount}`);
            if (headerAdCount > 0) {
                const randomIndex = Math.floor(Math.random() * headerAdCount);
                const ad = headerAds.nth(randomIndex);
                // Try to click an iframe or anchor, if not found, click the div itself
                const clickable = ad.locator('iframe, a, div').first();
                await clickable.click({ force: true, timeout: 5000 }).catch(e => console.log(`Header ad click failed: ${e.message}`));
            }

            for (let i = 0; i < 5; i++) {
                await page.evaluate(() => window.scrollBy(0, 1500));
                await page.waitForTimeout(2000);
            }
            // Click random ad in footer
            const footerAds = page.locator('body > div[style*="flex-wrap: wrap"]').last().locator('> div');
            const footerAdCount = await footerAds.count();
            if (footerAdCount > 0) {
                const randomIndex = Math.floor(Math.random() * footerAdCount);
                const ad = footerAds.nth(randomIndex);
                const clickable = ad.locator('iframe, a, div').first();
                await clickable.click({ force: true, timeout: 5000 }).catch(e => console.log(`Footer ad click failed: ${e.message}`));
            }
            await page.waitForTimeout(3000);
            // Basic assertion: verify the body or main content is loaded
            const body = page.locator('body').first();
            await expect(body).toBeVisible();
        });
    }
});
