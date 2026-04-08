const { test, expect } = require('@playwright/test');

test.describe('Blog Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/blog.html');
    });

    test('TC-BLOG-001: Articles Visibility', async ({ page }) => {
        await expect(page).toHaveTitle(/Blog \| YoutubeMulti/);
        
        // Ensure that at least a few article cards are present
        const articleCards = page.locator('.article-card');
        await expect(articleCards.first()).toBeVisible();
        
        // Assert that there are multiple article cards
        const count = await articleCards.count();
        expect(count).toBeGreaterThan(5);
        
        await page.waitForTimeout(30000);
    });

    test('TC-BLOG-002: Read More Navigation', async ({ page }) => {
        // Take the first article's read more link
        const firstReadMore = page.locator('.article-card .read-more-btn').first();
        await expect(firstReadMore).toBeVisible();
        
        // Check if the link opens in a new tab (target="_blank")
        await expect(firstReadMore).toHaveAttribute('target', '_blank');

        // Check it has a valid href linking to an article
        const href = await firstReadMore.getAttribute('href');
        expect(href).toMatch(/^article\/.*\.html$/);
        
        await page.waitForTimeout(30000);
    });
});
