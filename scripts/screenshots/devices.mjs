/**
 * Apple App Store Connect screenshot target specifications (2026).
 * Every width/height matches Apple's accepted pixel resolutions exactly.
 */

export const DEVICE_PROFILES = {
    'iphone-dynamic-island': {
        id: 'iphone-dynamic-island',
        label: 'iPhone with Dynamic Island (6.3" Medium – Required)',
        defaultSelected: true,
        width: 1206,
        height: 2622,
        simulator: {
            deviceNames: ['iPhone 18 Pro', 'iPhone 17 Pro', 'iPhone 16 Pro'],
            display: null,
        },
    },
    'iphone-dynamic-island-large': {
        id: 'iphone-dynamic-island-large',
        label: 'iPhone with Dynamic Island (6.9" Large)',
        defaultSelected: false,
        width: 1320,
        height: 2868,
        simulator: {
            deviceNames: ['iPhone 18 Pro Max', 'iPhone 17 Pro Max', 'iPhone 16 Pro Max'],
            display: null,
        },
    },
    'iphone-duo-outer': {
        id: 'iphone-duo-outer',
        label: 'iPhone Duo (5.4" Outer Display – Portrait)',
        defaultSelected: true,
        width: 1398,
        height: 2034,
        simulator: {
            deviceNames: ['iPhone Duo'],
            display: '1',
        },
    },
    'iphone-duo-inner': {
        id: 'iphone-duo-inner',
        label: 'iPhone Duo (7.6" Inner Display – Portrait)',
        defaultSelected: true,
        width: 2007,
        height: 2853,
        simulator: {
            deviceNames: ['iPhone Duo'],
            display: '3',
        },
    },
    'ipad-13': {
        id: 'ipad-13',
        label: 'iPad 13" Display (Portrait)',
        defaultSelected: true,
        width: 2064,
        height: 2752,
        simulator: {
            deviceNames: ['iPad Pro 13-inch (M5)', 'iPad Pro 13-inch (M4)', 'iPad Air 13-inch (M4)'],
            display: null,
        },
    },
};

export const DEFAULT_DEVICE_IDS = Object.values(DEVICE_PROFILES)
    .filter((device) => device.defaultSelected)
    .map((device) => device.id);

export function resolveDeviceProfiles(deviceSpec) {
    if (!deviceSpec) {
        return DEFAULT_DEVICE_IDS.map((id) => DEVICE_PROFILES[id]);
    }
    const requested = deviceSpec
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    if (requested.includes('all')) {
        return Object.values(DEVICE_PROFILES);
    }

    const unknown = requested.filter((id) => !DEVICE_PROFILES[id]);
    if (unknown.length > 0) {
        throw new Error(
            `Unknown device ID(s): ${unknown.join(', ')}. Valid IDs: ${Object.keys(DEVICE_PROFILES).join(', ')}`,
        );
    }
    return [...new Set(requested)].map((id) => DEVICE_PROFILES[id]);
}
