const { test, expect } = require('@playwright/test');

test.describe('MultiTube Pro E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('TC-008: Full User Flow - Generate and Watch', async ({ page }) => {
        const urls = [
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'https://www.youtube.com/watch?v=jNQXAC9IVRw',
            'https://www.youtube.com/watch?v=9bZkp7q19f0',
            'https://www.youtube.com/watch?v=kJQP7kiw5Fk'
        ];

        await page.locator('#videoUrls').fill(urls.join('\n'));
        await page.locator('#screenCount').fill('4');
        await page.getByRole('button', { name: 'Generate' }).click();

        await expect(page.locator('#activeCount')).toHaveText('4');

        // Check if 4 iframes are present
        const iframes = page.locator('.item-box iframe');
        await expect(iframes).toHaveCount(4);

        // Verify status is "Active"
        await expect(page.locator('#overallStatus')).toHaveText('Active');
    });

    test('TC-010: Ads Visibility', async ({ page }) => {
        // Header Ad
        await expect(page.locator('.ad-banner').filter({ hasText: 'ADVERTISEMENT' }).first()).toBeVisible();

        // Sidebar Ad
        await expect(page.locator('.sidebar-ad .ad-banner').filter({ hasText: 'VERTICAL AD' })).toBeVisible();

        // Footer Ad
        await expect(page.locator('.ad-banner').filter({ hasText: 'FOOTER AD' })).toBeVisible();
    });

    test('TC-011: Mobile Flow - Hamburger to Generation', async ({ page, isMobile }) => {
        if (!isMobile) return;

        // Open hamburger
        await page.locator('#hamburgerBtn').click();

        // Click Home in mobile nav
        await page.locator('.mobile-nav-links').first().getByRole('link', { name: 'Home' }).click();

        // Generate
        await page.locator('#videoUrls').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        await page.getByRole('button', { name: 'Generate' }).click();

        await expect(page.locator('#activeCount')).toHaveText('1');
        await expect(page.locator('.item-box iframe')).toBeVisible();
    });
});
