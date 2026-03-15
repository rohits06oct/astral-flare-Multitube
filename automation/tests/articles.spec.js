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
            for (let i = 0; i < 5; i++) {
                await page.evaluate(() => window.scrollBy(0, 1500));
                await page.waitForTimeout(2000);
            }
            await page.waitForTimeout(3000);
            // Basic assertion: verify the body or main content is loaded
            const body = page.locator('body').first();
            await expect(body).toBeVisible();

        });
    }
});
