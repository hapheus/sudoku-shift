import { useEffect } from 'react';
import { serializeGameState } from '../domain/sudoku-engine.js';
import { saveSoloGameSnapshot } from '../services/online-state-storage.js';
import { isEmbeddedSubpathApp, normalizePathname } from '../utils/app-routing.js';

const GAME_PING_INTERVAL_MS = 5000;

export function buildHintPreviewPayload(pendingHint) {
    if (!pendingHint) return null;
    return {
        mode: 'preview',
        index: pendingHint.index,
        digit: pendingHint.digit,
        technique: pendingHint.technique,
        unitType: pendingHint.unitType,
        unitIndex: pendingHint.unitIndex,
        contextEntries: Array.from(pendingHint.contextDelays.entries()),
    };
}

export function useGameTimersAndModals({
    navTab,
    isPlayingGame,
    isNativeApp,
    pendingConfirm,
    confirmCancelRef,
    stateRef,
    onlineClientRef,
    setGameState,
    onTickElapsed = null,
    setPendingConfirm,
    setLegalPage,
    syncLobbyProgress,
}) {
    // 1-second puzzle clock & periodic solo persistence
    useEffect(() => {
        const timer = setInterval(() => {
            if (navTab !== 'play' || !isPlayingGame || (typeof document !== 'undefined' && document.hidden)) {
                return;
            }
            if (stateRef.current.isHelpOpen || stateRef.current.pendingConfirm || stateRef.current.ticTacToeActive) {
                return;
            }
            if (onTickElapsed) {
                const cur = stateRef.current.gameState;
                if (!cur || stateRef.current.isSpectating || stateRef.current.mode === 'watch' || cur.status === 'solved') {
                    return;
                }
                const nextElapsed = (cur.elapsedSeconds || 0) + 1;
                cur.elapsedSeconds = nextElapsed;
                if (stateRef.current.mode === 'solo' && nextElapsed % 5 === 0) {
                    saveSoloGameSnapshot(cur, stateRef.current.onlineGameId, stateRef.current.boardBackground?.id || null);
                }
                onTickElapsed(nextElapsed);
                return;
            }
            setGameState((prev) => {
                if (stateRef.current.isSpectating || stateRef.current.mode === 'watch' || prev.status === 'solved') {
                    return prev;
                }
                const next = { ...prev, elapsedSeconds: (prev.elapsedSeconds || 0) + 1 };
                stateRef.current.gameState = next;
                if (stateRef.current.mode === 'solo' && next.elapsedSeconds % 5 === 0) {
                    saveSoloGameSnapshot(next, stateRef.current.onlineGameId, stateRef.current.boardBackground?.id || null);
                }
                return next;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isPlayingGame, navTab, onTickElapsed, setGameState, stateRef]);

    // 5-second state reconciliation & lobby heartbeat
    useEffect(() => {
        const timer = setInterval(() => {
            const cur = stateRef.current;
            const isBroadcaster = cur.isPlayingGame
                && (cur.mode === 'solo' || cur.mode === 'online')
                && Boolean(cur.onlineGameId)
                && !cur.isSpectating;
            if (!isBroadcaster) return;

            onlineClientRef.current?.sendGamePing({
                role: cur.myRole,
                gameState: serializeGameState(cur.gameState),
                ticTacToe: cur.myRole === 'host' ? cur.ticTacToeChallenge || null : undefined,
                isRetroMode: Boolean(cur.isRetroMode),
                boardBackgroundId: cur.boardBackground?.id || null,
                rematchRequestedBy: cur.rematchRequestedBy,
                hostCursorIndex: cur.myRole === 'host' ? cur.selectedIndex : undefined,
                hostActiveDigit: cur.myRole === 'host' ? cur.activeDigit : undefined,
                hintPreview: cur.myRole === 'host' ? buildHintPreviewPayload(cur.pendingHint) : null,
                timestamp: Date.now(),
            });

            syncLobbyProgress();
        }, GAME_PING_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [onlineClientRef, stateRef, syncLobbyProgress]);

    // Escape key handling and focus management for confirmation dialog
    useEffect(() => {
        if (!pendingConfirm) return undefined;
        confirmCancelRef.current?.focus();

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setPendingConfirm(null);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [confirmCancelRef, pendingConfirm, setPendingConfirm]);

    // Browser history synchronization for legal pages
    useEffect(() => {
        if (isNativeApp || isEmbeddedSubpathApp() || typeof window === 'undefined') return undefined;
        const onPopState = () => {
            const path = normalizePathname(window.location.pathname);
            if (path === '/privacy') {
                setLegalPage('privacy');
            } else if (path === '/impressum') {
                setLegalPage('impressum');
            } else {
                setLegalPage(null);
            }
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, [isNativeApp, setLegalPage]);
}
