#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { buildCleanXcodeEnv } from './ios-device.mjs';
import { DEVICE_PROFILES, resolveDeviceProfiles } from './screenshots/devices.mjs';
import { getDuoAngle, setDuoPosture } from './screenshots/duoPosture.mjs';
import { exportAppStorePng } from './screenshots/exportPng.mjs';
import {
    localScreenshotBroker,
    prepareScreenshotPath,
    screenshotBootstrap,
    screenshotScenes,
} from './screenshots/scenes.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const templates = path.join(root, 'scripts/ios-screenshots');
const bundleId = 'dev.fraha.sudoku.screenshots';
const defaultXcode = '/Applications/Xcode.app/Contents/Developer';
const env = buildCleanXcodeEnv({
    ...process.env,
    DEVELOPER_DIR: process.env.DEVELOPER_DIR || defaultXcode,
});

const usage = [
    'Usage: npm run appstore:screenshots -- [options]',
    '  --lang <en|de>          App language (default: en)',
    '  --devices <ids|all>     Comma-separated device IDs (default: iphone-dynamic-island,iphone-duo-outer,iphone-duo-inner,ipad-13)',
    '  --themes <all|dark|light> Themes to capture (default: all)',
    '  --out <dir>             Output root (default: artifacts/app-store/screenshots)',
    '  --ws-url <url>          Optional local loopback WebSocket broker URL for live Watch demo',
    '  --list                  List available devices and scenes and exit',
].join('\n');

function xcrun(args, options = {}) {
    return execFileSync('xcrun', args, { env, encoding: 'utf8', timeout: 60_000, ...options });
}

function listAvailableSimulators() {
    const parsed = JSON.parse(xcrun(['simctl', 'list', 'devices', 'available', '--json']));
    const all = [];
    for (const [runtime, devices] of Object.entries(parsed.devices ?? {})) {
        if (!runtime.includes('.iOS-')) continue;
        for (const device of devices) {
            if (device.isAvailable) {
                all.push({ ...device, runtime });
            }
        }
    }
    return all;
}

function resolveSimulator(deviceProfile, simulators) {
    for (const candidateName of deviceProfile.simulator.deviceNames) {
        const matches = simulators.filter((sim) => sim.name === candidateName);
        if (matches.length > 0) {
            return matches.find((sim) => sim.state === 'Booted') ?? matches[matches.length - 1];
        }
    }
    throw new Error(
        `No available iOS Simulator matching [${deviceProfile.simulator.deviceNames.join(', ')}] for "${deviceProfile.id}".`,
    );
}

function ensureBooted(udid, state) {
    if (state === 'Shutdown') {
        xcrun(['simctl', 'boot', udid]);
    }
    xcrun(['simctl', 'bootstatus', udid, '-b'], { stdio: 'inherit', timeout: 240_000 });
}

function overrideStatusBar(udid) {
    xcrun([
        'simctl', 'status_bar', udid, 'override',
        '--time', '9:41',
        '--dataNetwork', 'wifi',
        '--wifiMode', 'active',
        '--wifiBars', '3',
        '--cellularMode', 'active',
        '--cellularBars', '4',
        '--batteryState', 'charged',
        '--batteryLevel', '100',
    ]);
}

function setAppearance(udid, theme) {
    try {
        xcrun(['simctl', 'ui', udid, 'appearance', theme === 'dark' ? 'dark' : 'light']);
    } catch {
        // Ignore if unsupported
    }
}

function clearStatusBar(udid) {
    try {
        xcrun(['simctl', 'status_bar', udid, 'clear']);
    } catch {
        // Ignore cleanup errors
    }
}

function buildCaptureApp(directory, language, wsUrl) {
    const templateProject = path.join(root, 'ios/App');
    const iosProject = path.join(directory, 'ios/App');
    fs.mkdirSync(iosProject, { recursive: true });
    for (const folder of ['App', 'App.xcodeproj', 'CapApp-SPM']) {
        fs.cpSync(path.join(templateProject, folder), path.join(iosProject, folder), {
            recursive: true,
            filter: (source) => path.basename(source) !== 'public' && path.basename(source) !== 'xcuserdata',
        });
    }
    for (const file of ['package.json', 'capacitor.config.json']) {
        fs.copyFileSync(path.join(root, file), path.join(directory, file));
    }
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'dir');

    console.log('Building web bundle & syncing Capacitor iOS...');
    execFileSync('npm', ['run', 'build', '--', '--outDir', path.join(directory, 'dist'), '--logLevel', 'warn'], {
        cwd: root,
        stdio: 'inherit',
    });
    execFileSync(process.execPath, [path.join(root, 'node_modules/@capacitor/cli/bin/capacitor'), 'sync', 'ios'], {
        cwd: directory,
        stdio: 'inherit',
    });

    const app = path.join(iosProject, 'App');
    const publicDir = path.join(app, 'public');
    const index = path.join(publicDir, 'index.html');
    const bootstrap = `<script>${screenshotBootstrap(language, wsUrl)}</script>
<script src="/prepare-screenshot.js"></script>
`;
    const html = fs.readFileSync(index, 'utf8');
    fs.writeFileSync(index, html.replace('<script type="module"', `${bootstrap}<script type="module"`));
    fs.copyFileSync(prepareScreenshotPath, path.join(publicDir, 'prepare-screenshot.js'));
    fs.copyFileSync(path.join(templates, 'SceneDelegate.swift'), path.join(app, 'SceneDelegate.swift'));

    console.log('Building Debug iOS Simulator capture app (xcodebuild)...');
    xcrun([
        'xcodebuild',
        '-project', path.join(iosProject, 'App.xcodeproj'),
        '-scheme', 'App',
        '-configuration', 'Debug',
        '-destination', 'generic/platform=iOS Simulator',
        '-derivedDataPath', path.join(directory, 'build'),
        'CODE_SIGNING_ALLOWED=NO',
        `PRODUCT_BUNDLE_IDENTIFIER=${bundleId}`,
        '-quiet',
    ], {
        stdio: 'inherit',
        timeout: 600_000,
    });
    return path.join(directory, 'build/Build/Products/Debug-iphonesimulator/App.app');
}

async function prepareScene(documents, screen, theme) {
    const id = randomUUID();
    const requestPath = path.join(documents, 'screenshot-request.json');
    const nextRequest = `${requestPath}.tmp`;
    fs.writeFileSync(nextRequest, JSON.stringify({ id, screen, theme }));
    fs.renameSync(nextRequest, requestPath);
    const replyPath = path.join(documents, 'screenshot-ready.json');
    for (let attempt = 0; attempt < 160; attempt++) {
        await setTimeout(250);
        if (!fs.existsSync(replyPath)) continue;
        const reply = JSON.parse(fs.readFileSync(replyPath, 'utf8'));
        if (reply.id !== id) continue;
        if (reply.outcome !== 'ready') throw new Error(reply.outcome);
        return reply;
    }
    throw new Error(`The simulator did not render ${screen} (${theme}).`);
}

function captureDisplay({ udid, display, rawPath }) {
    const args = ['simctl', 'io', udid, 'screenshot'];
    if (display) {
        args.push(`--display=${display}`);
    }
    args.push('--type=png', '--mask=ignored', rawPath);
    xcrun(args);
}

function writeManifest(outputDir, results) {
    const manifestPath = path.join(outputDir, 'manifest.json');
    const existing = fs.existsSync(manifestPath)
        ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')).screenshots ?? []
        : [];

    const merged = new Map();
    for (const item of existing) {
        merged.set(`${item.lang}/${item.device}/${item.scene}`, item);
    }
    for (const item of results) {
        merged.set(`${item.lang}/${item.device}/${item.scene}`, {
            lang: item.lang,
            device: item.device,
            scene: item.scene,
            width: item.width,
            height: item.height,
            pixFmt: item.pixFmt,
            bytes: item.bytes,
            path: path.relative(root, item.outPath),
        });
    }

    const sorted = [...merged.values()].sort((a, b) =>
        `${a.lang}/${a.device}/${a.scene}`.localeCompare(`${b.lang}/${b.device}/${b.scene}`),
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

async function main() {
    const { values } = parseArgs({
        options: {
            help: { type: 'boolean', short: 'h' },
            list: { type: 'boolean' },
            lang: { type: 'string', default: 'en' },
            devices: { type: 'string' },
            themes: { type: 'string', default: 'all' },
            out: { type: 'string' },
            'ws-url': { type: 'string' },
        },
    });

    if (values.help) {
        console.log(usage);
        return;
    }

    if (values.list) {
        console.log('Devices:');
        for (const dev of Object.values(DEVICE_PROFILES)) {
            const marker = dev.defaultSelected ? '[default]' : '[opt]    ';
            console.log(
                `  ${dev.id.padEnd(28)} ${marker} ${String(dev.width).padStart(4)}x${String(dev.height).padEnd(4)}  ${dev.label}`,
            );
        }
        console.log('\nScenes:');
        for (const scene of screenshotScenes) {
            console.log(`  ${scene.screen}-${scene.theme}`);
        }
        return;
    }

    if (!['en', 'de'].includes(values.lang)) {
        throw new Error(`Unsupported --lang "${values.lang}". Use "en" or "de".`);
    }
    if (!['all', 'dark', 'light'].includes(values.themes)) {
        throw new Error(`Unsupported --themes "${values.themes}". Use "all", "dark", or "light".`);
    }

    const wsUrl = localScreenshotBroker(values['ws-url']);
    const devices = resolveDeviceProfiles(values.devices);
    const scenes = values.themes === 'all'
        ? screenshotScenes
        : screenshotScenes.filter((scene) => scene.theme === values.themes);
    const outputDir = path.resolve(values.out ?? path.join(root, 'artifacts/app-store/screenshots'));

    const simulators = listAvailableSimulators();
    const bySim = new Map();
    for (const device of devices) {
        const sim = resolveSimulator(device, simulators);
        const entry = bySim.get(sim.udid) ?? { sim, profiles: [] };
        entry.profiles.push(device);
        bySim.set(sim.udid, entry);
    }
    for (const entry of bySim.values()) {
        entry.profiles.sort((a, b) => {
            if (a.id === 'iphone-duo-outer' && b.id === 'iphone-duo-inner') return -1;
            if (a.id === 'iphone-duo-inner' && b.id === 'iphone-duo-outer') return 1;
            return 0;
        });
    }

    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sudoku-appstore-shots-'));
    const rawDir = path.join(workDir, 'raw');
    fs.mkdirSync(rawDir, { recursive: true });
    const results = [];

    try {
        const appPath = buildCaptureApp(workDir, values.lang, wsUrl);

        for (const { sim, profiles } of bySim.values()) {
            const isDuo = sim.name.includes('Duo') || profiles.some((p) => p.id.startsWith('iphone-duo'));
            console.log(`\nSimulator: ${sim.name} (${sim.udid}) -> ${profiles.map((p) => p.id).join(', ')}`);
            ensureBooted(sim.udid, sim.state);

            const initialDuoAngle = isDuo ? getDuoAngle(sim.udid) : null;
            let appInstalled = false;

            try {
                xcrun(['simctl', 'install', sim.udid, appPath], { timeout: 240_000 });
                appInstalled = true;

                const data = xcrun(['simctl', 'get_app_container', sim.udid, bundleId, 'data']).trim();
                const documents = path.join(data, 'Documents');
                fs.mkdirSync(documents, { recursive: true });

                for (const profile of profiles) {
                    if (isDuo) {
                        const posture = profile.id === 'iphone-duo-inner' ? 'inner' : 'outer';
                        console.log(`  Setting iPhone Duo posture -> ${posture} (display ${profile.simulator.display})...`);
                        setDuoPosture(sim.udid, posture);
                    }

                    overrideStatusBar(sim.udid);
                    for (const file of ['screenshot-request.json', 'screenshot-ready.json']) {
                        fs.rmSync(path.join(documents, file), { force: true });
                    }
                    xcrun(['simctl', 'launch', '--terminate-running-process', sim.udid, bundleId]);

                    for (const { screen, theme } of scenes) {
                        setAppearance(sim.udid, theme);
                        await prepareScene(documents, screen, theme);
                        await setTimeout(150);

                        const sceneId = `${screen}-${theme}`;
                        const rawPath = path.join(rawDir, `${values.lang}-${profile.id}-${sceneId}.png`);
                        const outPath = path.join(outputDir, values.lang, profile.id, `${sceneId}.png`);

                        captureDisplay({
                            udid: sim.udid,
                            display: profile.simulator.display,
                            rawPath,
                        });

                        const info = exportAppStorePng({
                            rawPath,
                            outPath,
                            expectedWidth: profile.width,
                            expectedHeight: profile.height,
                            allowScale: false,
                        });

                        results.push({
                            lang: values.lang,
                            device: profile.id,
                            scene: sceneId,
                            ...info,
                        });
                        console.log(`  OK ${values.lang}/${profile.id}/${sceneId} (${info.width}x${info.height}, ${info.pixFmt})`);
                    }
                }
            } finally {
                if (appInstalled) {
                    try {
                        xcrun(['simctl', 'terminate', sim.udid, bundleId]);
                    } catch {
                        // Already stopped
                    }
                }
                clearStatusBar(sim.udid);
                if (isDuo && initialDuoAngle !== null) {
                    try {
                        setDuoPosture(sim.udid, initialDuoAngle > 90 ? 'inner' : 'outer');
                    } catch {
                        // Best-effort posture restore
                    }
                }
            }
        }

        const manifestPath = writeManifest(outputDir, results);
        console.log(`\nDone! Generated ${results.length} App Store screenshot(s) in ${outputDir}`);
        console.log(`Manifest: ${manifestPath}`);
    } finally {
        fs.rmSync(workDir, { recursive: true, force: true });
    }
}

main().catch((error) => {
    console.error(error?.stack || error?.message || error);
    process.exitCode = 1;
});
