import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: (query) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    });
}

if (typeof HTMLMediaElement !== 'undefined') {
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
        configurable: true,
        writable: true,
        value: () => Promise.resolve(),
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
        configurable: true,
        writable: true,
        value: () => {},
    });
}

