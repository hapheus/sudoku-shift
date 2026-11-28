#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';
import { build, preview } from 'vite';
import { startLocalCentrifugo } from './promo/recorder.mjs';
import { exportAppStorePng } from './screenshots/exportPng.mjs';
import { PLAY_DEVICE_PROFILES, resolvePlayDeviceProfiles } from './screenshots/playDevices.mjs';
import {
    localScreenshotBroker,
    prepareScreenshotPath,
    screenshotBootstrap,
    screenshotScenes,
} from './screenshots/scenes.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

const FASTLANE_LANG_MAP = {
    en: 'en-US',
    de: 'de-DE',
};

const FASTLANE_SELECTIONS = {
    phone: [
        { orientation: 'portrait', scene: 'game-dark', name: '01-game-dark.png' },
        { orientation: 'portrait', scene: 'game-light', name: '02-game-light.png' },
        { orientation: 'portrait', scene: 'setup-dark', name: '03-setup-dark.png' },
        { orientation: 'portrait', scene: 'setup-light', name: '04-setup-light.png' },
        { orientation: 'portrait', scene: 'watch-live-dark', name: '05-watch-live-dark.png' },
        { orientation: 'portrait', scene: 'settings-dark', name: '06-settings-dark.png' },
        { orientation: 'portrait', scene: 'retro-dark', name: '07-retro-dark.png' },
        { orientation: 'portrait', scene: 'night-ghost-dark', name: '08-night-ghost-dark.png' },
    ],
    'tablet-7': [
        { orientation: 'landscape', scene: 'game-dark', name: '01-game-dark-landscape.png' },
        { orientation: 'landscape', scene: 'game-light', name: '02-game-light-landscape.png' },
        { orientation: 'landscape', scene: 'setup-light', name: '03-setup-light-landscape.png' },
        { orientation: 'landscape', scene: 'watch-live-dark', name: '04-watch-live-dark-landscape.png' },
        { orientation: 'portrait', scene: 'game-dark', name: '05-game-dark-portrait.png' },
        { orientation: 'portrait', scene: 'settings-dark', name: '06-settings-dark-portrait.png' },
        { orientation: 'landscape', scene: 'retro-dark', name: '07-retro-dark-landscape.png' },
        { orientation: 'landscape', scene: 'night-ghost-dark', name: '08-night-ghost-dark-landscape.png' },
    ],
    'tablet-10': [
        { orientation: 'landscape', scene: 'game-dark', name: '01-game-dark-landscape.png' },
        { orientation: 'landscape', scene: 'game-light', name: '02-game-light-landscape.png' },
        { orientation: 'landscape', scene: 'setup-light', name: '03-setup-light-landscape.png' },
        { orientation: 'landscape', scene: 'watch-live-dark', name: '04-watch-live-dark-landscape.png' },
        { orientation: 'portrait', scene: 'game-dark', name: '05-game-dark-portrait.png' },
        { orientation: 'portrait', scene: 'settings-dark', name: '06-settings-dark-portrait.png' },
        { orientation: 'landscape', scene: 'retro-dark', name: '07-retro-dark-landscape.png' },
        { orientation: 'landscape', scene: 'night-ghost-dark', name: '08-night-ghost-dark-landscape.png' },
    ],
};

const usage = [
    'Usage: npm run playstore:screenshots -- [options]',
    '  --lang <en|de|all>            App language (default: all)',
    '  --devices <ids|all>           Comma-separated device IDs (default: phone,tablet-7,tablet-10)',
    '  --orientations <all|portrait|landscape> Orientations to capture (default: all)',
    '  --themes <all|dark|light>     Themes to capture (default: all)',
    '  --out <dir>                   Output root (default: artifacts/play-store/screenshots)',
    '  --sync-fastlane               Copy curated 8-shot selection into android/fastlane/metadata/android',
    '  --ws-url <url>                Optional local loopback WebSocket broker URL for live Watch demo',
    '  --list                        List available devices and scenes and exit',
].join('\n');

async function startLiveWatchHost({ baseUrl, language, wsUrl }) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 900, height: 700 } });
    await context.addInitScript({
        content: screenshotBootstrap(language, wsUrl).replace('RiverPuzzle', 'HostNova'),
    });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('#resume-game-btn').waitFor({ state: 'visible', timeout: 15_000 });
    await page.locator('#resume-game-btn').click();
    await page.locator('#sudoku-board .sudoku-cell').first().waitFor({ state: 'visible', timeout: 15_000 });
    await setTimeout(1200);
    return {
        async stop() {
            await context.close().catch(() => {});
            await browser.close().catch(() => {});
        },
    };
}

async function captureProfileOrientation({
    browser,
    baseUrl,
    rawDir,
    outputDir,
    language,
    wsUrl,
    profile,
    orientation,
    scenes,
}) {
    const expectedWidth = orientation === 'landscape' ? profile.height : profile.width;
    const expectedHeight = orientation === 'landscape' ? profile.width : profile.height;
    const scale = profile.deviceScaleFactor;

    const context = await browser.newContext({
        viewport: {
            width: Math.round(expectedWidth / scale),
            height: Math.round(expectedHeight / scale),
        },
        deviceScaleFactor: scale,
        locale: language === 'de' ? 'de-DE' : 'en-US',
        hasTouch: true,
        isMobile: profile.isMobile,
        userAgent: profile.userAgent,
    });

    await context.addInitScript({
        content: `window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android' };\n${screenshotBootstrap(language, wsUrl)}\n${fs.readFileSync(prepareScreenshotPath, 'utf8')}`,
    });

    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    const results = [];
    try {
        for (const { screen, theme } of scenes) {
            let outcome = await page.evaluate(
                (req) => window.prepareScreenshot(req),
                { screen, theme, orientation },
            );
            if (outcome !== 'ready') {
                await setTimeout(500);
                outcome = await page.evaluate(
                    (req) => window.prepareScreenshot(req),
                    { screen, theme, orientation },
                );
            }
            if (outcome !== 'ready') {
                throw new Error(`Play Store capture failed for ${language}/${profile.id}/${orientation}/${screen}-${theme}: ${outcome}`);
            }
            await setTimeout(150);

            const sceneId = `${screen}-${theme}`;
            const rawPath = path.join(rawDir, `${language}-${profile.id}-${orientation}-${sceneId}.png`);
            const outPath = path.join(outputDir, language, profile.id, orientation, `${sceneId}.png`);
            await page.screenshot({ path: rawPath, fullPage: false, animations: 'disabled' });

            const info = exportAppStorePng({
                rawPath,
                outPath,
                expectedWidth,
                expectedHeight,
                allowScale: false,
            });

            results.push({
                lang: language,
                device: profile.id,
                orientation,
                scene: sceneId,
                ...info,
            });
            console.log(`  OK ${language}/${profile.id}/${orientation}/${sceneId} (${info.width}x${info.height}, ${info.pixFmt})`);
        }
        return results;
    } finally {
        await context.close();
    }
}

function writeManifest(outputDir, results) {
    const manifestPath = path.join(outputDir, 'manifest.json');
    let existing = [];
    try {
        existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).screenshots ?? [];
    } catch (error) {
        if (error?.code !== 'ENOENT') throw error;
    }

    const merged = new Map();
    for (const item of existing) {
        merged.set(`${item.lang}/${item.device}/${item.orientation ?? 'portrait'}/${item.scene}`, item);
    }
    for (const item of results) {
        merged.set(`${item.lang}/${item.device}/${item.orientation}/${item.scene}`, {
            lang: item.lang,
            device: item.device,
            orientation: item.orientation,
            scene: item.scene,
            width: item.width,
            height: item.height,
            pixFmt: item.pixFmt,
            bytes: item.bytes,
            path: path.relative(root, item.outPath),
        });
    }

    const sorted = [...merged.values()].sort((a, b) =>
        `${a.lang}/${a.device}/${a.orientation ?? 'portrait'}/${a.scene}`.localeCompare(
            `${b.lang}/${b.device}/${b.orientation ?? 'portrait'}/${b.scene}`,
        ),
    );

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
        manifestPath,
        `${JSON.stringify({
            generatedAt: new Date().toISOString(),
            count: sorted.length,
            screenshots: sorted,
        }, null, 2)}\n`,
        'utf8',
    );
    return manifestPath;
}

function syncToFastlane(outputDir, languages, devices) {
    let copied = 0;
    for (const lang of languages) {
        const fastlaneLang = FASTLANE_LANG_MAP[lang];
        if (!fastlaneLang) continue;

        for (const profile of devices) {
            const selections = FASTLANE_SELECTIONS[profile.id];
            if (!selections) continue;

            const targetDir = path.join(
                root,
                'android/fastlane/metadata/android',
                fastlaneLang,
                'images',
                profile.fastlaneDir,
            );
            fs.mkdirSync(targetDir, { recursive: true });
            for (const file of fs.readdirSync(targetDir)) {
                if (file.endsWith('.png')) {
                    fs.rmSync(path.join(targetDir, file), { force: true });
                }
            }

            for (const item of selections) {
                const src = path.join(outputDir, lang, profile.id, item.orientation, `${item.scene}.png`);
                if (!fs.existsSync(src)) continue;
                fs.copyFileSync(src, path.join(targetDir, item.name));
                copied += 1;
            }
        }
    }
    console.log(`Synced ${copied} screenshot(s) to android/fastlane/metadata/android/*/images/`);
}

async function main() {
    const { values } = parseArgs({
        options: {
            help: { type: 'boolean', short: 'h' },
            list: { type: 'boolean' },
            lang: { type: 'string', default: 'all' },
            devices: { type: 'string' },
            orientations: { type: 'string', default: 'all' },
            themes: { type: 'string', default: 'all' },
            out: { type: 'string' },
            'sync-fastlane': { type: 'boolean', default: false },
            'ws-url': { type: 'string' },
        },
    });

    if (values.help) {
        console.log(usage);
        return;
    }

    if (values.list) {
        console.log('Devices:');
        for (const dev of Object.values(PLAY_DEVICE_PROFILES)) {
            const marker = dev.defaultSelected ? '[default]' : '[opt]    ';
            console.log(
                `  ${dev.id.padEnd(16)} ${marker} ${String(dev.width).padStart(4)}x${String(dev.height).padEnd(4)} -> ${dev.fastlaneDir.padEnd(22)} ${dev.label}`,
            );
        }
        console.log('\nScenes:');
        for (const scene of screenshotScenes) {
            console.log(`  ${scene.screen}-${scene.theme}`);
        }
        return;
    }

    if (!['en', 'de', 'all'].includes(values.lang)) {
        throw new Error(`Unsupported --lang "${values.lang}". Use "en", "de", or "all".`);
    }
    if (!['all', 'dark', 'light'].includes(values.themes)) {
        throw new Error(`Unsupported --themes "${values.themes}". Use "all", "dark", or "light".`);
    }
    if (!['all', 'portrait', 'landscape'].includes(values.orientations)) {
        throw new Error(`Unsupported --orientations "${values.orientations}". Use "all", "portrait", or "landscape".`);
    }

    let wsUrl = localScreenshotBroker(values['ws-url']);
    const languages = values.lang === 'all' ? ['en', 'de'] : [values.lang];
    const devices = resolvePlayDeviceProfiles(values.devices);
    const orientations = values.orientations === 'all' ? ['portrait', 'landscape'] : [values.orientations];
    const scenes = values.themes === 'all'
        ? screenshotScenes
        : screenshotScenes.filter((scene) => scene.theme === values.themes);
    const outputDir = path.resolve(values.out ?? path.join(root, 'artifacts/play-store/screenshots'));
    const needsLiveWatch = scenes.some((scene) => scene.screen === 'watch-live');

    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sudoku-playstore-shots-'));
    const distDir = path.join(workDir, 'dist');
    const rawDir = path.join(workDir, 'raw');
    fs.mkdirSync(rawDir, { recursive: true });

    const results = [];
    let broker = null;
    let server = null;
    let browser = null;

    try {
        if (!wsUrl && needsLiveWatch) {
            console.log('Starting temporary Centrifugo broker on 127.0.0.1:18083 for live Watch Mode...');
            broker = await startLocalCentrifugo({
                root,
                port: 18083,
                containerName: 'sudoku-playstore-centrifugo',
            });
            wsUrl = broker.wsUrl;
        }

        console.log('Building web bundle...');
        await build({ root, build: { outDir: distDir }, logLevel: 'warn' });
        server = await preview({
            root,
            build: { outDir: distDir },
            preview: { host: '127.0.0.1', port: 0 },
            logLevel: 'warn',
        });
        const { port } = server.httpServer.address();
        const baseUrl = `http://127.0.0.1:${port}`;
        browser = await chromium.launch({ headless: true });

        for (const language of languages) {
            console.log(`\n=== Language: ${language} ===`);
            let liveHost = null;
            try {
                if (needsLiveWatch && wsUrl) {
                    console.log(`Starting live Host session (HostNova) for ${language} Watch Mode spectating...`);
                    liveHost = await startLiveWatchHost({ baseUrl, language, wsUrl });
                }

                for (const profile of devices) {
                    console.log(`\nDevice: ${profile.label}`);
                    for (const orientation of orientations) {
                        const themeGroups = values.themes === 'all' ? ['dark', 'light'] : [values.themes];
                        for (const themeGroup of themeGroups) {
                            const groupScenes = scenes.filter((scene) => scene.theme === themeGroup);
                            const captured = await captureProfileOrientation({
                                browser,
                                baseUrl,
                                rawDir,
                                outputDir,
                                language,
                                wsUrl,
                                profile,
                                orientation,
                                scenes: groupScenes,
                            });
                            results.push(...captured);
                        }
                    }
                }
            } finally {
                await liveHost?.stop();
            }
        }

        const manifestPath = writeManifest(outputDir, results);
        console.log(`\nDone! Generated ${results.length} Play Store screenshot(s) in ${outputDir}`);
        console.log(`Manifest: ${manifestPath}`);

        if (values['sync-fastlane']) {
            syncToFastlane(outputDir, languages, devices);
        }
    } finally {
        await browser?.close().catch(() => {});
        await server?.close().catch(() => {});
        broker?.stop();
        fs.rmSync(workDir, { recursive: true, force: true });
    }
}

main().catch((error) => {
    console.error(error?.stack || error?.message || error);
    process.exitCode = 1;
});
