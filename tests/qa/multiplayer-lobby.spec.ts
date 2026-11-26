import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const viewports: Array<[number, number]> = [
    [360, 640],
    [390, 844],
    [768, 1024],
    [1280, 800],
    [1440, 900],
    [844, 390],
];

async function checkAccessibility(page: Page, testInfo: TestInfo, state: string) {
    const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
    await testInfo.attach(`axe-${state}`, {
        body: JSON.stringify(violations, null, 2),
        contentType: 'application/json',
    });
    expect(violations, `Accessibility: ${state}`).toEqual([]);
}

async function setupOfflineApp(page: Page, theme = 'dark') {
    await page.addInitScript(({ theme }) => {
        if (!localStorage.getItem('sudoku_theme')) {
            localStorage.setItem('sudoku_theme', theme);
            localStorage.setItem('sudoku_lang', 'en');
        }
    }, { theme });
    await page.routeWebSocket(/.*/, (socket) => socket.close());
    await page.goto('/');
}

for (const variant of ['3x3', '2x3']) {
    test(`spectator reactions match the digit keys and stay in one row (${variant})`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 640 });
        await page.addInitScript(variant => localStorage.setItem('sudoku_variant', variant), variant);
        await page.routeWebSocket(/.*/, socket => socket.close());
        await page.goto('/games/reaction-layout?watch=1');

        const reactions = page.getByRole('group', { name: 'Send emoji reaction' }).getByRole('button');
        await expect(reactions).toHaveCount(6);
        await expect(page.locator('.spectator-pad__btn')).toHaveCount(variant === '3x3' ? 9 : 6);
        for (const [width, height] of [[320, 640], [640, 320], [1280, 800]]) {
            await page.setViewportSize({ width, height });
            await expect.poll(() => reactions.evaluateAll(buttons => {
                const digits = document.querySelectorAll('.spectator-pad__btn');
                const rowTop = buttons[0]?.getBoundingClientRect().top;
                return buttons.length === 6 && buttons.every((button, index) => {
                    const reaction = button.getBoundingClientRect();
                    const digit = digits[index].getBoundingClientRect();
                    return reaction.top === rowTop && reaction.width === digit.width && reaction.height === digit.height;
                });
            })).toBe(true);
        }
    });
}

test('player name initializes randomly, persists custom name across reload, and passes keyboard/a11y checks', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await setupOfflineApp(page, 'dark');

    await page.getByRole('tab', { name: 'Settings', exact: true }).click();
    const input = page.getByRole('textbox', { name: 'Player Name' });
    await expect(input).toBeVisible();

    const initialName = await input.inputValue();
    expect(initialName.length).toBeGreaterThanOrEqual(4);

    // Keyboard edit custom name
    await input.focus();
    await input.fill('NovaPlayer');
    await expect(input).toHaveValue('NovaPlayer');
    await expect(page.locator('#player-tag-display')).toHaveText(/^NovaPlayer#[0-9a-f]{4}$/);

    // Reload and verify local persistence
    await page.reload();
    await page.getByRole('tab', { name: 'Settings', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Player Name' })).toHaveValue('NovaPlayer');

    // Randomize via keyboard
    const randomizeBtn = page.getByRole('button', { name: 'Randomize player name' });
    await randomizeBtn.focus();
    await page.keyboard.press('Enter');
    const nameInput = page.getByRole('textbox', { name: 'Player Name' });
    await expect(nameInput).not.toHaveValue('NovaPlayer');
    const randomized = await nameInput.inputValue();
    expect(randomized.length).toBeGreaterThanOrEqual(4);

    // Check touch targets >= 44x44
    const inputBox = await page.getByRole('textbox', { name: 'Player Name' }).boundingBox();
    const btnBox = await randomizeBtn.boundingBox();
    expect(inputBox?.height).toBeGreaterThanOrEqual(44);
    expect(btnBox?.width).toBeGreaterThanOrEqual(44);
    expect(btnBox?.height).toBeGreaterThanOrEqual(44);

    await checkAccessibility(page, testInfo, 'settings-player-name');
});

for (const theme of ['dark', 'light']) {
    for (const [width, height] of viewports) {
        test(`watch and settings responsive layout & a11y (${theme} ${width}x${height})`, async ({ page }, testInfo) => {
            await page.setViewportSize({ width, height });
            await setupOfflineApp(page, theme);

            // Watch screen
            await page.getByRole('tab', { name: 'Watch', exact: true }).click();
            await expect(page.getByRole('searchbox', { name: 'Search live games' })).toBeVisible();
            const joins = page.getByRole('combobox', { name: 'Joins' });
            const sizes = page.getByRole('combobox', { name: 'Sizes' });
            await expect(joins).toBeVisible();
            await expect(sizes).toBeVisible();
            await expect(joins.getByRole('option')).toHaveText(['All', 'Open', 'CoOps', 'Closed']);
            await expect(sizes.getByRole('option')).toHaveText(['All', '3x3', '2x3']);
            const watch = page.locator('#watch-directory');
            expect(await watch.evaluate(directory => {
                const pane = directory.parentElement!.getBoundingClientRect();
                const fullWidth = ['.watch-filters', '.watch-empty'];
                const contained = ['#watch-search-input', '#watch-joins-filter', '#watch-sizes-filter'];
                return fullWidth.every(selector => {
                    const bounds = directory.querySelector(selector)!.getBoundingClientRect();
                    return Math.abs(bounds.left - pane.left) <= 1 && Math.abs(bounds.right - pane.right) <= 1;
                }) && contained.every(selector => {
                    const bounds = directory.querySelector(selector)!.getBoundingClientRect();
                    return bounds.left >= pane.left - 1 && bounds.right <= pane.right + 1;
                });
            })).toBe(true);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await checkAccessibility(page, testInfo, `watch-${theme}-${width}x${height}`);

            // Settings screen
            await page.getByRole('tab', { name: 'Settings', exact: true }).click();
            await expect(page.getByRole('textbox', { name: 'Player Name' })).toBeVisible();
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await checkAccessibility(page, testInfo, `settings-${theme}-${width}x${height}`);
            if ((width === 390 && height === 844) || (width === 1280 && height === 800)) {
                await page.screenshot({ path: testInfo.outputPath(`settings-${theme}-${width}x${height}.png`), fullPage: true });
            }
        });
    }
}
