import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HELPER_SOURCE = path.join(__dirname, 'duoHingeHelper.m');

function cleanXcodeEnv() {
    return {
        HOME: process.env.HOME ?? '',
        USER: process.env.USER ?? '',
        PATH: '/Applications/Xcode.app/Contents/Developer/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin',
        DEVELOPER_DIR: '/Applications/Xcode.app/Contents/Developer',
    };
}

function sleepSync(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

let cachedHelperPath = null;

export function ensureDuoHingeHelper() {
    if (cachedHelperPath && fs.existsSync(cachedHelperPath)) {
        return cachedHelperPath;
    }
    const arch = process.arch === 'x64' ? 'x86_64' : 'arm64';
    const outPath = path.join(os.tmpdir(), `sudoku-duo-hinge-helper-${arch}`);
    const srcMtime = fs.statSync(HELPER_SOURCE).mtimeMs;
    const binStat = fs.statSync(outPath, { throwIfNoEntry: false });

    if (!binStat || binStat.mtimeMs < srcMtime) {
        execFileSync(
            'xcrun',
            [
                '--sdk',
                'iphonesimulator',
                'clang',
                '-arch',
                arch,
                '-mios-simulator-version-min=17.0',
                '-fobjc-arc',
                '-framework',
                'Foundation',
                '-framework',
                'CoreFoundation',
                '-framework',
                'IOKit',
                '-framework',
                'CoreMotion',
                HELPER_SOURCE,
                '-o',
                outPath,
            ],
            { env: cleanXcodeEnv(), stdio: 'pipe' },
        );
    }
    cachedHelperPath = outPath;
    return outPath;
}

function runHelper(udid, args) {
    const helper = ensureDuoHingeHelper();
    return execFileSync('xcrun', ['simctl', 'spawn', udid, helper, ...args], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
}

export function getDuoDisplayStates(udid) {
    const raw = execFileSync('xcrun', ['devicectl', 'device', 'info', 'displays', '--device', udid], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    const displays = [];
    const blocks = raw.split(/\n▿\s+/);
    for (const block of blocks.slice(1)) {
        const idMatch = block.match(/displayId:\s*(\d+)/);
        const nameMatch = block.match(/name:\s*(\S+)/);
        const orientMatch = block.match(/currentOrientation:\s*(\S+)/);
        const backlightMatch = block.match(/backlightState:\s*([^\n]+)/);
        if (idMatch && nameMatch) {
            displays.push({
                id: idMatch[1],
                name: nameMatch[1],
                orientation: orientMatch?.[1] ?? 'unknown',
                backlight: backlightMatch?.[1]?.trim() ?? 'unknown',
                active: /on and active/i.test(backlightMatch?.[1] ?? ''),
            });
        }
    }
    return displays;
}

export function getDuoAngle(udid) {
    try {
        return Number.parseFloat(runHelper(udid, ['get']));
    } catch {
        return null;
    }
}

/**
 * Transitions a booted iPhone Duo simulator cleanly into either:
 * - 'outer': folded closed (0°), portrait rot0, LCD (display 1, 1398x2034) active
 * - 'inner': unfolded flat (180°), portrait rot0 (device landscape-left), LCD-1 (display 3, 2007x2853) active
 */
export function setDuoPosture(udid, targetPosture) {
    const targetDisplayId = targetPosture === 'inner' ? '3' : '1';
    const targetAngle = targetPosture === 'inner' ? 180 : 0;
    const targetDeviceOrient = targetPosture === 'inner' ? 'landscape-left' : 'portrait';

    const alreadyReady = () => {
        const displays = getDuoDisplayStates(udid);
        const target = displays.find((d) => d.id === targetDisplayId);
        const angle = getDuoAngle(udid);
        const angleMatches =
            angle === null
                ? true
                : targetPosture === 'inner'
                    ? angle >= 150
                    : angle <= 30;
        return Boolean(target?.active && target.orientation === 'rot0' && angleMatches);
    };

    if (alreadyReady()) {
        return;
    }

    if (targetPosture === 'outer') {
        try {
            execFileSync('xcrun', ['simctl', 'shutdown', udid], { stdio: 'pipe' });
        } catch {
            // Ignore if already shut down
        }
        execFileSync('xcrun', ['simctl', 'boot', udid], { stdio: 'pipe' });
        execFileSync('xcrun', ['simctl', 'bootstatus', udid, '-b'], { stdio: 'pipe' });
        const bootDeadline = Date.now() + 15000;
        while (Date.now() < bootDeadline) {
            const displays = getDuoDisplayStates(udid);
            const outer = displays.find((d) => d.id === '1');
            if (outer?.active && outer.orientation === 'rot0') {
                sleepSync(1500);
                return;
            }
            sleepSync(500);
        }
    }

    const currentAngle = getDuoAngle(udid) ?? (targetPosture === 'inner' ? 0 : 180);

    if (Math.abs(currentAngle - targetAngle) > 2) {
        runHelper(udid, ['sweep', String(currentAngle), String(targetAngle), '0.6']);
        runHelper(udid, ['set', String(targetAngle), '3']);
    }

    const deadline = Date.now() + 8000;
    let orientApplied = false;
    while (Date.now() < deadline) {
        const displays = getDuoDisplayStates(udid);
        const target = displays.find((d) => d.id === targetDisplayId);
        if (target?.active) {
            if (target.orientation === 'rot0') {
                sleepSync(400);
                return;
            }
            if (!orientApplied) {
                runHelper(udid, ['orient', targetDeviceOrient]);
                orientApplied = true;
            }
        }
        sleepSync(350);
    }

    runHelper(udid, ['orient', targetDeviceOrient]);
    sleepSync(1200);
    const finalDisplays = getDuoDisplayStates(udid);
    const finalTarget = finalDisplays.find((d) => d.id === targetDisplayId);
    if (!finalTarget?.active || finalTarget.orientation !== 'rot0') {
        throw new Error(
            `iPhone Duo did not settle into "${targetPosture}" portrait (display ${targetDisplayId}). Observed displays: ${JSON.stringify(finalDisplays)}`,
        );
    }
}

export function setDuoOrientation(udid, posture, orientation) {
    const deviceOrient = posture === 'inner'
        ? (orientation === 'landscape' ? 'portrait' : 'landscape-left')
        : (orientation === 'landscape' ? 'landscape-left' : 'portrait');
    runHelper(udid, ['orient', deviceOrient]);
    sleepSync(700);
}

export function setSimulatorOrientation(udid, orientation) {
    const deviceOrient = orientation === 'landscape' ? 'landscape-left' : 'portrait';
    runHelper(udid, ['orient', deviceOrient]);
    sleepSync(700);
}
