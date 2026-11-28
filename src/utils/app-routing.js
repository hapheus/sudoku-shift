import { isValidGameId } from '../services/ws-config.js';

export const APP_STORE_URL = 'https://apps.apple.com/app/sudoku-shift/id6834748729';
// Set to 'https://play.google.com/store/apps/details?id=dev.fraha.sudoku' once published
export const PLAY_STORE_URL = null;

export function isNativeCapacitorApp() {
    return typeof window !== 'undefined' && Boolean(window.Capacitor?.isNativePlatform?.());
}

export function isEmbeddedSubpathApp() {
    const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
    if (env.VITE_ITCH_BUILD === 'true') return true;
    if (typeof window === 'undefined') return false;
    const host = window.location?.hostname || '';
    if (host.endsWith('.itch.zone') || host === 'itch.io' || host.endsWith('.itch.io')) {
        return true;
    }
    try {
        return window.self !== window.top;
    } catch {
        return true;
    }
}

export function hasUnsavedProgress(state) {
    if (!state || state.status === 'solved') return false;
    const givenCount = Array.isArray(state.givens) ? state.givens.filter(Boolean).length : 0;
    const hasNotes = Array.isArray(state.notes) && state.notes.some((arr) => Array.isArray(arr) && arr.length > 0);
    return Boolean((state.history && state.history.length > 0) || state.filledCount > givenCount || hasNotes);
}

export function normalizePathname(pathname) {
    let path = pathname || '/';
    while (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    return path || '/';
}

export function parseInitialRoute() {
    if (typeof window === 'undefined') {
        return { initialMode: 'solo', initialGameId: null, initialWatch: false, initialLegalPage: null };
    }

    const isNative = isNativeCapacitorApp();
    const pathname = normalizePathname(window.location.pathname);
    if (!isNative && pathname === '/privacy') {
        return { initialMode: 'solo', initialGameId: null, initialWatch: false, initialLegalPage: 'privacy' };
    }
    if (!isNative && pathname === '/impressum') {
        return { initialMode: 'solo', initialGameId: null, initialWatch: false, initialLegalPage: 'impressum' };
    }

    const params = new URLSearchParams(window.location.search);
    const pathMatch = window.location.pathname.match(/^\/games\/([A-Za-z0-9_-]{6,64})\/?$/);
    const queryGame = params.get('game');
    const gameId = pathMatch?.[1] || (isValidGameId(queryGame) ? queryGame : null);
    const watch = params.get('watch') === '1' && Boolean(gameId);

    if (watch && gameId) {
        return { initialMode: 'watch', initialGameId: gameId, initialWatch: true, initialLegalPage: null };
    }
    if (gameId) {
        return { initialMode: 'online', initialGameId: gameId, initialWatch: false, initialLegalPage: null };
    }
    return { initialMode: 'solo', initialGameId: null, initialWatch: false, initialLegalPage: null };
}

function mutateBrowserHistory(method, path) {
    if (typeof window === 'undefined') return;
    if (isNativeCapacitorApp() || isEmbeddedSubpathApp() || !window.location.protocol.startsWith('http')) {
        return;
    }
    window.history[method]({}, '', path);
}

export function updateBrowserUrl(path) {
    mutateBrowserHistory('pushState', path);
}

export function replaceBrowserUrl(path) {
    mutateBrowserHistory('replaceState', path);
}
