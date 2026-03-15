const { test, expect } = require('@playwright/test');

test.describe('Subscription Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/subscription.html');
    });

    test('TC-SUB-001: Pricing Visibility', async ({ page }) => {
        await expect(page).toHaveTitle(/Pricing & Plans \| YoutubeMulti Pro/);
        
        const freePlan = page.locator('.pricing-card').filter({ hasText: 'Free Plan' });
        await expect(freePlan).toBeVisible();
        await expect(freePlan.locator('.price')).toHaveText(/\$0/);

        const proPlan = page.locator('.pricing-card').filter({ hasText: 'Pro Plan' });
        await expect(proPlan).toBeVisible();
        await expect(proPlan.locator('.price')).toContainText('$0.12');
    });

    test('TC-SUB-002: Feature Comparison Table', async ({ page }) => {
        const table = page.locator('table');
        await expect(table).toBeVisible();

        // Check if there are columns for Free and Pro
        await expect(table.locator('th').filter({ hasText: 'Free' })).toBeVisible();
        await expect(table.locator('th').filter({ hasText: 'Pro' })).toBeVisible();

        // Check for specific features
        const videoUrlRow = table.locator('tr').filter({ hasText: 'Video URL Limit' });
        await expect(videoUrlRow).toBeVisible();
        await expect(videoUrlRow.locator('td').nth(1)).toHaveText('10');
        await expect(videoUrlRow.locator('td').nth(2)).toHaveText('30');
    });
});
