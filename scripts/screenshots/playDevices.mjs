/**
 * Google Play Store screenshot target specifications (2026).
 * Every profile renders with Playwright Chromium using an Android user agent
 * so Framework7 (`theme="auto"`) activates Material Design (`md`) styling.
 */

export const PLAY_DEVICE_PROFILES = {
    phone: {
        id: 'phone',
        label: 'Android Smartphone (1080x1920 – 9:16)',
        defaultSelected: true,
        width: 1080,
        height: 1920,
        deviceScaleFactor: 3,
        isMobile: true,
        fastlaneDir: 'phoneScreenshots',
        userAgent:
            'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
    },
    'tablet-7': {
        id: 'tablet-7',
        label: 'Android 7" Tablet (1200x1920 – 16:10)',
        defaultSelected: true,
        width: 1200,
        height: 1920,
        deviceScaleFactor: 2,
        isMobile: false,
        fastlaneDir: 'sevenInchScreenshots',
        userAgent:
            'Mozilla/5.0 (Linux; Android 15; Pixel Tablet) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    },
    'tablet-10': {
        id: 'tablet-10',
        label: 'Android 10" Tablet (1600x2560 – 16:10)',
        defaultSelected: true,
        width: 1600,
        height: 2560,
        deviceScaleFactor: 2,
        isMobile: false,
        fastlaneDir: 'tenInchScreenshots',
        userAgent:
            'Mozilla/5.0 (Linux; Android 15; SM-X910) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    },
};

export const DEFAULT_PLAY_DEVICE_IDS = Object.values(PLAY_DEVICE_PROFILES)
    .filter((device) => device.defaultSelected)
    .map((device) => device.id);

export function resolvePlayDeviceProfiles(deviceSpec) {
    if (!deviceSpec) {
        return DEFAULT_PLAY_DEVICE_IDS.map((id) => PLAY_DEVICE_PROFILES[id]);
    }
    const requested = deviceSpec
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    if (requested.includes('all')) {
        return Object.values(PLAY_DEVICE_PROFILES);
    }

    const unknown = requested.filter((id) => !PLAY_DEVICE_PROFILES[id]);
    if (unknown.length > 0) {
        throw new Error(
            `Unknown device ID(s): ${unknown.join(', ')}. Valid IDs: ${Object.keys(PLAY_DEVICE_PROFILES).join(', ')}`,
        );
    }
    return [...new Set(requested)].map((id) => PLAY_DEVICE_PROFILES[id]);
}
