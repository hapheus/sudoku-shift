import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const colorScheme of ['dark', 'light'] as const) {
    for (const [width, height] of [[360, 640], [390, 844], [768, 1024], [1280, 800], [1440, 900], [812, 375]]) {
        test(`system follows OS and respects explicit overrides (${colorScheme} ${width}x${height})`, async ({ page }) => {
            await page.setViewportSize({ width, height });
            await page.emulateMedia({ colorScheme });
            await page.addInitScript(() => localStorage.setItem('sudoku_lang', 'en'));
            await page.routeWebSocket(/.*/, socket => socket.close());
            await page.goto('/');
            await page.getByRole('tab', { name: 'Settings', exact: true }).click();
            const appearance = page.getByRole('combobox', { name: 'Appearance' });
            await expect(appearance).toHaveValue('system');
            await expect(page.locator('html')).toHaveAttribute('data-theme', colorScheme);
            await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', colorScheme === 'dark' ? '#11141a' : '#f7f5f0');
            const box = (await appearance.boundingBox())!;
            expect(box.width).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeGreaterThanOrEqual(44);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()).violations).toEqual([]);
            await expect(appearance).toHaveScreenshot(`issue48-system-${colorScheme}-${width}x${height}.png`);
            const other = colorScheme === 'dark' ? 'light' : 'dark';
            await page.emulateMedia({ colorScheme: other });
            await expect(page.locator('html')).toHaveAttribute('data-theme', other);
            expect(await page.evaluate(() => document.documentElement.style.colorScheme)).toBe(other);
            await appearance.selectOption('dark');
            await page.emulateMedia({ colorScheme: 'light' });
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
            await appearance.selectOption('light');
            await page.emulateMedia({ colorScheme: 'dark' });
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
            await page.reload();
            await page.getByRole('tab', { name: 'Settings', exact: true }).click();
            await expect(appearance).toHaveValue('light');
        });
    }
}
