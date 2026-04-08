const { test, expect } = require('@playwright/test');

test.describe('YoutubeMulti Regression Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('TC-001: Header Navigation', async ({ page, isMobile }) => {
        await expect(page).toHaveTitle(/YoutubeMulti/);

        const navLinks = ['About', 'Contact', 'Pricing'];

        for (const linkText of navLinks) {
            if (isMobile) {
                await page.locator('#hamburgerBtn').click();
                const mobileMenu = page.locator('.mobile-menu-container');
                await expect(mobileMenu).toBeVisible();
                await mobileMenu.getByRole('link', { name: linkText }).click();
            } else {
                const nav = page.locator('nav');
                await nav.getByRole('link', { name: linkText }).click();
            }

            await expect(page.url()).toContain(linkText.toLowerCase() === 'pricing' ? 'subscription' : linkText.toLowerCase());
            await page.goto('/');
        }
        
        await page.waitForTimeout(30000);
    });

    test('TC-002: YouTube Link Parsing and Generation', async ({ page }) => {
        const textarea = page.locator('#videoUrls');
        await textarea.fill('https://www.youtube.com/shorts/9k6onvOYVj8');

        const screenInput = page.locator('#screenCount');
        await screenInput.fill('2');

        await page.getByRole('button', { name: 'Generate' }).click();

        const activeCount = page.locator('#activeCount');
        await expect(activeCount).toHaveText('2');
        await page.waitForTimeout(150000);
        await expect(page.locator('.item-box iframe')).toHaveCount(2);

        await page.waitForTimeout(30000);
    });

    test('TC-003: Reset Functionality', async ({ page }) => {
        // Fill and generate first
        await page.locator('#videoUrls').fill('https://www.youtube.com/shorts/9k6onvOYVj8');
        await page.getByRole('button', { name: 'Generate' }).click();
        await expect(page.locator('#activeCount')).toHaveText('4');

        // Reset
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'Reset' }).click();
        page.on('dialog', dialog => dialog.accept());

        await expect(page.locator('#activeCount')).toHaveText('0');
        await expect(page.locator('.empty-state')).toBeVisible();
        await expect(page.locator('#videoUrls')).toHaveValue('');

        await page.waitForTimeout(30000);
    });

    test('TC-004: Subscription Enforcement', async ({ page }) => {
        // Enter 11 links (limit is 10 for free)
        const urls = Array(11).fill('https://www.youtube.com/shorts/9k6onvOYVj8').join('\n');
        await page.locator('#videoUrls').fill(urls);

        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'Generate' }).click();

        await expect(page.url()).toContain('http://localhost:8000/subscription');

        await page.waitForTimeout(30000);
    });

    test('TC-005: Hamburger Menu Visibility (Mobile only)', async ({ page, isMobile }) => {
        if (!isMobile) return;
        const hamburger = page.locator('#hamburgerBtn');
        await expect(hamburger).toBeVisible();

        await page.waitForTimeout(30000);
    });

    test('TC-006: Mobile Navigation (Mobile only)', async ({ page, isMobile }) => {
        if (!isMobile) return;
        await page.locator('#hamburgerBtn').click();
        const mobileMenu = page.locator('.mobile-menu-container');
        await expect(mobileMenu).toBeVisible();

        await mobileMenu.getByRole('link', { name: 'About' }).click();
        await expect(page.url()).toContain('http://localhost:8000/about');

        await page.waitForTimeout(30000);
    });
});
