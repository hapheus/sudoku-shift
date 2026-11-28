#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const APP_ID = 'dev.fraha.sudoku';
const MAIN_ACTIVITY = `${APP_ID}/.MainActivity`;
const DEBUG_APK = path.join(REPO_ROOT, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');

/**
 * Resolve ANDROID_HOME from env or standard macOS/Linux SDK locations.
 * @param {NodeJS.ProcessEnv} baseEnv
 * @returns {string | null}
 */
function resolveAndroidHome(baseEnv) {
    const candidates = [
        baseEnv.ANDROID_HOME,
        baseEnv.ANDROID_SDK_ROOT,
        path.join(os.homedir(), 'Library', 'Android', 'sdk'),
        path.join(os.homedir(), 'Android', 'Sdk'),
    ].filter(Boolean);

    return candidates.find((dir) => fs.existsSync(dir)) || null;
}

/**
 * Resolve the adb binary path.
 * @param {NodeJS.ProcessEnv} env
 * @returns {string}
 */
function resolveAdb(env) {
    const androidHome = resolveAndroidHome(env);
    if (androidHome) {
        const candidate = path.join(androidHome, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb');
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    return 'adb';
}

/**
 * Parse `adb devices -l` output into connected devices.
 * @param {string} adbBin
 * @param {NodeJS.ProcessEnv} env
 * @returns {Array<{ serial: string, state: string, model: string, raw: string }>}
 */
function listDevices(adbBin, env) {
    const output = execFileSync(adbBin, ['devices', '-l'], {
        env,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    const devices = [];
    for (const line of output.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('List of devices')) {
            continue;
        }
        const parts = trimmed.split(/\s+/);
        const serial = parts[0];
        const state = parts[1] || 'unknown';
        const modelMatch = trimmed.match(/model:(\S+)/);
        devices.push({
            serial,
            state,
            model: modelMatch ? modelMatch[1].replaceAll('_', ' ') : serial,
            raw: trimmed,
        });
    }
    return devices;
}

function main() {
    const args = process.argv.slice(2);
    const listOnly = args.includes('--list');
    const noSync = args.includes('--no-sync');
    const noBuild = args.includes('--no-build');
    const noLaunch = args.includes('--no-launch');
    const showHelp = args.includes('--help') || args.includes('-h');

    if (showHelp) {
        console.log([
            'Usage: npm run android:devices',
            '       npm run android:device [-- --serial <id>] [-- --no-sync] [-- --no-build] [-- --no-launch]',
        ].join('\n'));
        return;
    }

    const serialIndex = args.indexOf('--serial');
    const requestedSerial = serialIndex >= 0 ? args[serialIndex + 1] : null;

    const env = { ...process.env };
    const androidHome = resolveAndroidHome(env);
    if (androidHome) {
        env.ANDROID_HOME = androidHome;
        env.ANDROID_SDK_ROOT = androidHome;
        const platformTools = path.join(androidHome, 'platform-tools');
        if (fs.existsSync(platformTools) && !String(env.PATH || '').includes(platformTools)) {
            env.PATH = `${platformTools}${path.delimiter}${env.PATH || ''}`;
        }
    }

    const adbBin = resolveAdb(env);
    const devices = listDevices(adbBin, env);

    if (listOnly) {
        if (devices.length === 0) {
            console.log('No Android devices detected. Enable USB/Wireless debugging and accept the prompt on the phone.');
            return;
        }
        for (const device of devices) {
            console.log(`${device.serial}\t${device.state}\t${device.model}`);
        }
        return;
    }

    const readyDevices = devices.filter((d) => d.state === 'device');
    if (readyDevices.length === 0) {
        console.error('No authorized Android device found. Run `npm run android:devices` to inspect.');
        process.exit(1);
    }

    const target = requestedSerial
        ? readyDevices.find((d) => d.serial === requestedSerial)
        : readyDevices[0];

    if (!target) {
        console.error(`Android device "${requestedSerial}" not found among ready devices: ${readyDevices.map((d) => d.serial).join(', ')}`);
        process.exit(1);
    }

    if (!noBuild) {
        const buildArgs = ['run', 'android:build'];
        if (noSync) {
            buildArgs.push('--', '--no-sync');
        }
        execFileSync('npm', buildArgs, {
            cwd: REPO_ROOT,
            env,
            stdio: 'inherit',
        });
    }

    if (!fs.existsSync(DEBUG_APK)) {
        console.error(`Missing debug APK at ${DEBUG_APK}`);
        process.exit(1);
    }

    console.log(`\nInstalling on ${target.model} (${target.serial})...`);
    execFileSync(adbBin, ['-s', target.serial, 'install', '-r', DEBUG_APK], {
        cwd: REPO_ROOT,
        env,
        stdio: 'inherit',
    });

    if (!noLaunch) {
        console.log(`Launching ${MAIN_ACTIVITY}...`);
        execFileSync(adbBin, ['-s', target.serial, 'shell', 'am', 'start', '-n', MAIN_ACTIVITY], {
            cwd: REPO_ROOT,
            env,
            stdio: 'inherit',
        });
    }
}

main();
