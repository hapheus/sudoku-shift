import { useCallback, useEffect, useMemo, useState } from 'react';
import { getMessages } from '../locales/index.js';
import {
    loadJoinsAllowed,
    loadJoinsAutoAccept,
    resolveJoinPolicy,
    saveJoinsAllowed,
    saveJoinsAutoAccept,
} from '../services/join-settings.js';
import {
    generateRandomPlayerName,
    loadOrCreatePlayerName,
    savePlayerName,
} from '../services/player-name.js';
import { getStorageItem, setStorageItem } from '../utils/storage.js';

export function useAppPreferences() {
    const [theme, setTheme] = useState(() => {
        const stored = getStorageItem('sudoku_theme');
        return ['dark', 'light', 'system'].includes(stored) ? stored : 'system';
    });
    const [language, setLanguage] = useState(() => (
        getStorageItem('sudoku_lang') === 'de' ? 'de' : 'en'
    ));
    const [playerName, setPlayerNameState] = useState(() => loadOrCreatePlayerName());
    const [joinsAllowed, setJoinsAllowed] = useState(() => loadJoinsAllowed());
    const [joinsAutoAccept, setJoinsAutoAccept] = useState(() => loadJoinsAutoAccept());
    const joinPolicy = useMemo(() => resolveJoinPolicy(joinsAllowed, joinsAutoAccept), [joinsAllowed, joinsAutoAccept]);
    const messages = useMemo(() => getMessages(language), [language]);

    const setPlayerName = useCallback((nextName) => {
        const saved = savePlayerName(nextName);
        if (saved) {
            setPlayerNameState(saved);
        }
        return saved;
    }, []);

    const randomizePlayerName = useCallback(() => {
        const generated = generateRandomPlayerName();
        savePlayerName(generated);
        setPlayerNameState(generated);
        return generated;
    }, []);

    useEffect(() => {
        const media = window.matchMedia?.('(prefers-color-scheme: dark)');
        const applyTheme = () => {
            let effective = theme;
            if (theme === 'system') effective = media?.matches === false ? 'light' : 'dark';
            document.documentElement.dataset.theme = effective;
            document.documentElement.classList.toggle('dark', effective === 'dark');
            document.documentElement.style.colorScheme = effective;
            document.querySelector('meta[name="theme-color"]')?.setAttribute(
                'content', effective === 'light' ? '#f7f5f0' : '#11141a',
            );
        };
        applyTheme();
        setStorageItem('sudoku_theme', theme);
        if (theme !== 'system' || !media) return;
        media.addEventListener('change', applyTheme);
        return () => media.removeEventListener('change', applyTheme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.lang = language;
        setStorageItem('sudoku_lang', language);
    }, [language]);

    useEffect(() => {
        saveJoinsAllowed(joinsAllowed);
    }, [joinsAllowed]);

    useEffect(() => {
        saveJoinsAutoAccept(joinsAutoAccept);
    }, [joinsAutoAccept]);

    return {
        theme,
        setTheme,
        language,
        setLanguage,
        playerName,
        setPlayerName,
        randomizePlayerName,
        joinsAllowed,
        setJoinsAllowed,
        joinsAutoAccept,
        setJoinsAutoAccept,
        joinPolicy,
        messages,
    };
}
