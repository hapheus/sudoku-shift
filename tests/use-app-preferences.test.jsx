import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppPreferences } from '../src/hooks/useAppPreferences.js';

describe('useAppPreferences', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.removeAttribute('lang');
    });

    afterEach(() => vi.unstubAllGlobals());

    it('follows OS changes only in system mode and removes its listener', () => {
        const media = Object.assign(new EventTarget(), { matches: false });
        const remove = vi.spyOn(media, 'removeEventListener');
        vi.stubGlobal('matchMedia', vi.fn(() => media));
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.append(meta);
        const { result, unmount } = renderHook(() => useAppPreferences());
        expect(result.current.theme).toBe('system');
        expect(document.documentElement.dataset.theme).toBe('light');
        expect(document.documentElement.style.colorScheme).toBe('light');
        expect(meta.content).toBe('#f7f5f0');
        act(() => { media.matches = true; media.dispatchEvent(new Event('change')); });
        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(meta.content).toBe('#11141a');
        expect(localStorage.getItem('sudoku_theme')).toBe('system');
        act(() => result.current.setTheme('light'));
        expect(remove).toHaveBeenCalledWith('change', expect.any(Function));
        act(() => media.dispatchEvent(new Event('change')));
        expect(document.documentElement.dataset.theme).toBe('light');
        act(() => result.current.setTheme('system'));
        expect(document.documentElement.dataset.theme).toBe('dark');
        unmount();
        expect(remove).toHaveBeenCalledTimes(2);
        meta.remove();
    });

    it.each(['dark', 'light', 'system'])('preserves stored %s preference', theme => {
        localStorage.setItem('sudoku_theme', theme);
        const { result } = renderHook(() => useAppPreferences());
        expect(result.current.theme).toBe(theme);
    });

    it('initializes defaults and persists theme and language updates', () => {
        const { result } = renderHook(() => useAppPreferences());

        expect(result.current.theme).toBe('system');
        expect(result.current.language).toBe('en');
        expect(result.current.joinPolicy).toBe('confirm');
        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(document.documentElement.lang).toBe('en');

        act(() => {
            result.current.setTheme('light');
            result.current.setLanguage('de');
            result.current.setJoinsAutoAccept(true);
        });

        expect(document.documentElement.dataset.theme).toBe('light');
        expect(document.documentElement.lang).toBe('de');
        expect(localStorage.getItem('sudoku_theme')).toBe('light');
        expect(localStorage.getItem('sudoku_lang')).toBe('de');
        expect(result.current.joinPolicy).toBe('auto');
    });
});
