const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const RealDate = window.Date;
let clockOffsetMs = 0;

class MockDate extends RealDate {
    constructor(...args) {
        if (args.length === 0) {
            super(RealDate.now() + clockOffsetMs);
        } else {
            super(...args);
        }
    }

    static now() {
        return RealDate.now() + clockOffsetMs;
    }
}

window.Date = MockDate;

let nightGhostDayOffset = 0;

function setClockBeforeMidnight(msBeforeMidnight = 350) {
    const now = RealDate.now();
    const target = new RealDate(now);
    target.setHours(24, 0, 0, 0);
    target.setDate(target.getDate() + nightGhostDayOffset);
    nightGhostDayOffset += 1;
    clockOffsetMs = target.getTime() - msBeforeMidnight - now;
}

function resetClock() {
    clockOffsetMs = 0;
}

async function visible(selector, maxAttempts = 100) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const node = document.querySelector(selector);
        if (node?.getBoundingClientRect().width) return node;
        await delay(100);
    }
    throw new Error(`Screen did not show ${selector}`);
}

async function ensureNotRetro() {
    if (document.documentElement.dataset.retro === 'true') {
        const exitBtn = [...document.querySelectorAll('button')].find((btn) => /back to \d{4}/i.test(btn.textContent || ''));
        if (exitBtn) {
            exitBtn.click();
            await delay(150);
        }
    }
}

async function triggerKonamiRetro() {
    const cell = await visible('#sudoku-board .sudoku-cell');
    cell.click();
    await delay(80);
    const sequence = [
        '#shift-row-up-btn', '#shift-row-up-btn',
        '#shift-row-down-btn', '#shift-row-down-btn',
        '#shift-col-left-btn', '#shift-col-right-btn',
        '#shift-col-left-btn', '#shift-col-right-btn',
    ];
    for (const selector of sequence) {
        (await visible(selector)).click();
        await delay(60);
    }
    const clickLetter = async (letter) => {
        for (let attempt = 0; attempt < 30; attempt++) {
            const btn = [...document.querySelectorAll('button')].find(
                (node) => node.getAttribute('aria-label') === letter || node.textContent?.trim() === letter,
            );
            if (btn?.getBoundingClientRect().width) {
                btn.click();
                return;
            }
            await delay(50);
        }
        throw new Error(`Konami button ${letter} not found`);
    };
    await clickLetter('B');
    await delay(60);
    await clickLetter('A');
    for (let attempt = 0; attempt < 30; attempt++) {
        if (document.documentElement.dataset.retro === 'true') return;
        await delay(100);
    }
    throw new Error('Retro mode did not activate');
}

window.prepareScreenshot = async ({ screen, theme }) => {
    try {
        resetClock();
        await ensureNotRetro();

        document.querySelector('#exit-watch-btn')?.click();
        document.querySelector('#back-to-setup-btn')?.click();
        (await visible('#nav-settings')).click();
        const themeSelect = await visible('#sudoku-theme');
        themeSelect.value = theme;
        themeSelect.dispatchEvent(new Event('change', { bubbles: true }));

        if (screen !== 'settings') {
            (await visible(screen === 'watch' || screen === 'watch-live' ? '#nav-watch' : '#nav-play')).click();
        }
        if (screen === 'game' || screen === 'retro' || screen === 'night-ghost') {
            (await visible('#resume-game-btn')).click();
            await visible('#sudoku-board .sudoku-cell');
            if (screen === 'retro') {
                await triggerKonamiRetro();
            } else if (screen === 'night-ghost') {
                for (const key of Object.keys(localStorage)) {
                    if (key.startsWith('sudoku_night_ghost_v1/')) {
                        localStorage.removeItem(key);
                    }
                }
                setClockBeforeMidnight(350);
                window.dispatchEvent(new Event('pageshow'));
                await visible('.night-ghost', 50);
                await delay(450);
            }
        } else if (screen === 'setup') {
            await visible('#start-game-btn');
        } else if (screen === 'watch') {
            await visible('#watch-directory');
            if (window.screenshotConfig.liveWatch) {
                await visible('#live-games-list [data-watch-id]');
            }
        } else if (screen === 'watch-live') {
            await visible('#watch-directory');
            const watchBtn = await visible('#live-games-list [data-watch-id]', 120);
            watchBtn.click();
            await visible('#exit-watch-btn', 120);
            await visible('#sudoku-board .sudoku-cell', 120);
            await delay(300);
        }

        for (let attempt = 0; document.documentElement.dataset.theme !== theme; attempt++) {
            if (attempt === 30) throw new Error(`Theme did not change to ${theme}`);
            await delay(100);
        }
        await Promise.all([...document.images]
            .filter((image) => image.getBoundingClientRect().width)
            .map((image) => image.decode().catch(() => {})));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return 'ready';
    } catch (error) {
        return error.message;
    }
};
