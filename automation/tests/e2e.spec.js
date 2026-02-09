const { test, expect } = require('@playwright/test');

test.describe('YoutubeMulti Pro E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('TC-008: Full User Flow - Generate and Watch', async ({ page }) => {
        const urls = [
            'https://www.youtube.com/shorts/9k6onvOYVj8',
            'https://www.youtube.com/watch?v=jNQXAC9IVRw',
            'https://www.youtube.com/watch?v=9bZkp7q19f0',
            'https://www.youtube.com/shorts/9k6onvOYVj8'
        ];

        await page.locator('#videoUrls').fill(urls.join('\n'));
        await page.locator('#screenCount').fill('4');
        await page.getByRole('button', { name: 'Generate' }).click();

        await expect(page.locator('#activeCount')).toHaveText('4');

        // Check if 4 iframes are present
        const iframes = page.locator('.item-box iframe');
        await page.waitForTimeout(150000);
        await expect(iframes).toHaveCount(4);

        // Verify status is "Active"
        await expect(page.locator('#overallStatus')).toHaveText('Active');
    });

    // test('TC-010: Ads Visibility', async ({ page }) => {
    //     // Header Ad
    //     await expect(page.locator('.ad-banner').filter({ hasText: 'ADVERTISEMENT' }).first()).toBeVisible();

    //     // Sidebar Ad
    //     await expect(page.locator('.sidebar-ad .ad-banner').filter({ hasText: 'VERTICAL AD' })).toBeVisible();

    //     // Footer Ad
    //     await expect(page.locator('.ad-banner').filter({ hasText: 'FOOTER AD' })).toBeVisible();
    // });

    test('TC-011: Navigation and Generation Flow', async ({ page, isMobile }) => {
        // Navigation Step
        if (isMobile) {
            await page.locator('#hamburgerBtn').click();
            await page.locator('.mobile-nav-links').first().getByRole('link', { name: 'Home' }).click();
        } else {
            await page.locator('nav').getByRole('link', { name: 'Home' }).click();
        }

        // Generate Step
        await page.locator('#videoUrls').fill('https://www.youtube.com/shorts/9k6onvOYVj8');
        await page.getByRole('button', { name: 'Generate' }).click();

        await expect(page.locator('#activeCount')).toHaveText('4');

        // Assertions
        const iframes = page.locator('.item-box iframe');
        await page.waitForTimeout(150000);
        await expect(iframes).toHaveCount(4);
        await expect(iframes.first()).toBeVisible();
    });
});
