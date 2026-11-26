import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createSudokuGame, fillCandidateNotes, serializeGameState, setCellValue } from '../../src/domain/sudoku-engine.js';

export const prepareScreenshotPath = fileURLToPath(new URL('./prepare.js', import.meta.url));
export const screenshotScenes = ['dark', 'light'].flatMap((theme) =>
    ['setup', 'game', 'settings', 'watch', 'watch-live', 'retro', 'night-ghost'].map((screen) => ({ screen, theme })));

export function localScreenshotBroker(value) {
    if (!value) return undefined;
    const url = new URL(value);
    if (!['ws:', 'wss:'].includes(url.protocol) || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
        throw new Error('Use a loopback WebSocket URL for the private Watch demo.');
    }
    return url.href;
}

function seedPuzzle() {
    let game = createSudokuGame({ variant: '3x3', difficulty: 'hard' });
    const emptyCells = game.board.flatMap((value, index) => value ? [] : [index]);
    for (const [index, cell] of emptyCells.entries()) {
        if (index % 4 === 0) game = setCellValue(game, cell, game.solution[cell], { recordHistory: false });
    }
    return JSON.stringify({ gameState: serializeGameState(fillCandidateNotes(game)), roomId: randomUUID() });
}

export function screenshotBootstrap(language, wsUrl) {
    const settings = {
        sudoku_lang: language,
        sudoku_theme: 'dark',
        sudoku_variant: '3x3',
        sudoku_player_name: 'RiverPuzzle',
        sudoku_solo_snapshot_v1: seedPuzzle(),
    };
    const config = { wsUrl: wsUrl ?? 'ws://127.0.0.1:1/connection/websocket' };
    return `
window.__APP_CONFIG__ = ${JSON.stringify(config)};
window.screenshotConfig = { liveWatch: ${Boolean(wsUrl)} };
for (const [key, value] of Object.entries(${JSON.stringify(settings)})) localStorage.setItem(key, value);
`;
}
