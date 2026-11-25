import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { BottomNav } from '../src/components/BottomNav.jsx';
import { SettingsPanel } from '../src/components/SettingsPanel.jsx';
import { VariantSelector } from '../src/components/VariantSelector.jsx';
import { DifficultySelector } from '../src/components/DifficultySelector.jsx';
import { StatusBanner } from '../src/components/StatusBanner.jsx';
import { PlayerControls } from '../src/components/PlayerControls.jsx';
import { WatcherInteractions } from '../src/components/WatcherInteractions.jsx';
import { HelpDialog } from '../src/components/HelpDialog.jsx';
import { SolveSummary } from '../src/components/SolveSummary.jsx';
import deMessages from '../src/locales/de.json';
import { createSudokuGame, setCellValue } from '../src/domain/sudoku-engine.js';
import {
    clearSoloGameSnapshot,
    loadSoloGameSnapshot,
    saveSoloGameSnapshot,
} from '../src/services/online-state-storage.js';
import {
    loadJoinsAllowed,
    loadJoinsAutoAccept,
    resolveJoinPolicy,
} from '../src/services/join-settings.js';

const SAMPLE_SOLUTION = [
    5, 3, 4, 6, 7, 8, 9, 1, 2,
    6, 7, 2, 1, 9, 5, 3, 4, 8,
    1, 9, 8, 3, 4, 2, 5, 6, 7,
    8, 5, 9, 7, 6, 1, 4, 2, 3,
    4, 2, 6, 8, 5, 3, 7, 9, 1,
    7, 1, 3, 9, 2, 4, 8, 5, 6,
    9, 6, 1, 5, 3, 7, 2, 8, 4,
    2, 8, 7, 4, 1, 9, 6, 3, 5,
    3, 4, 5, 2, 8, 6, 1, 7, 9,
];

const SAMPLE_2X3_SOLUTION = [
    1, 2, 3, 4, 5, 6,
    4, 5, 6, 1, 2, 3,
    2, 3, 1, 6, 4, 5,
    5, 6, 4, 2, 3, 1,
    3, 1, 2, 5, 6, 4,
    6, 4, 5, 3, 1, 2,
];

describe('UI/UX components & Solo persistence', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('supports WAI-ARIA arrow-key navigation with focus transfer in 3-tab BottomNav', () => {
        const onSelectTab = vi.fn();
        render(<BottomNav activeTab="play" onSelectTab={onSelectTab} />);

        const playTab = screen.getByRole('tab', { name: 'Play' });
        const watchTab = screen.getByRole('tab', { name: 'Watch' });
        const settingsTab = screen.getByRole('tab', { name: 'Settings' });

        expect(playTab).toHaveAttribute('tabindex', '0');
        expect(watchTab).toHaveAttribute('tabindex', '-1');
        expect(settingsTab).toHaveAttribute('tabindex', '-1');

        playTab.focus();
        fireEvent.keyDown(playTab, { key: 'ArrowRight' });
        expect(onSelectTab).toHaveBeenCalledWith('watch');
        expect(document.activeElement).toBe(watchTab);

        fireEvent.keyDown(watchTab, { key: 'End' });
        expect(onSelectTab).toHaveBeenCalledWith('settings');
        expect(document.activeElement).toBe(settingsTab);
    });

    it('emits theme, language, join rules, music, sound, volume, and guide callbacks in SettingsPanel', () => {
        expect(loadJoinsAllowed()).toBe(true);
        expect(loadJoinsAutoAccept()).toBe(false);
        expect(resolveJoinPolicy(true, false)).toBe('confirm');
        expect(resolveJoinPolicy(true, true)).toBe('auto');
        expect(resolveJoinPolicy(false, true)).toBe('disabled');

        const onChangeTheme = vi.fn();
        const onChangeLanguage = vi.fn();
        const onChangeJoinsAllowed = vi.fn();
        const onChangeJoinsAutoAccept = vi.fn();
        const onChangeMusicEnabled = vi.fn();
        const onChangeMusicVolume = vi.fn();
        const onChangeSoundEnabled = vi.fn();
        const onChangeSoundVolume = vi.fn();
        const onOpenGuide = vi.fn();
        const { rerender } = render(
            <SettingsPanel
                theme="dark"
                language="en"
                joinsAllowed
                joinsAutoAccept={false}
                musicEnabled
                musicVolume={0.45}
                soundEnabled
                soundVolume={0.65}
                onChangeTheme={onChangeTheme}
                onChangeLanguage={onChangeLanguage}
                onChangeJoinsAllowed={onChangeJoinsAllowed}
                onChangeJoinsAutoAccept={onChangeJoinsAutoAccept}
                onChangeMusicEnabled={onChangeMusicEnabled}
                onChangeMusicVolume={onChangeMusicVolume}
                onChangeSoundEnabled={onChangeSoundEnabled}
                onChangeSoundVolume={onChangeSoundVolume}
                onOpenGuide={onOpenGuide}
            />,
        );

        const appearance = screen.getByRole('combobox', { name: 'Appearance' });
        fireEvent.change(appearance, { target: { value: 'system' } });
        expect(onChangeTheme).toHaveBeenCalledWith('system');
        fireEvent.change(appearance, { target: { value: 'light' } });
        expect(onChangeTheme).toHaveBeenCalledWith('light');

        const languageSelect = screen.getByRole('combobox', { name: 'Language' });
        const guideButton = screen.getByRole('button', { name: 'Open Guide' });
        expect(guideButton.compareDocumentPosition(languageSelect) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        fireEvent.change(languageSelect, { target: { value: 'de' } });
        expect(onChangeLanguage).toHaveBeenCalledWith('de');

        const joins = screen.getByRole('combobox', { name: 'Joins' });
        expect(joins).toHaveValue('confirm');
        fireEvent.change(joins, { target: { value: 'disabled' } });
        expect(onChangeJoinsAllowed).toHaveBeenLastCalledWith(false);
        expect(onChangeJoinsAutoAccept).toHaveBeenLastCalledWith(false);
        fireEvent.change(joins, { target: { value: 'auto' } });
        expect(onChangeJoinsAllowed).toHaveBeenLastCalledWith(true);
        expect(onChangeJoinsAutoAccept).toHaveBeenLastCalledWith(true);

        const musicGroup = screen.getByRole('radiogroup', { name: 'Background Music' });
        fireEvent.click(musicGroup.querySelector('input[value="false"]'));
        expect(onChangeMusicEnabled).toHaveBeenCalledWith(false);

        const musicSlider = screen.getByRole('slider', { name: 'Volume: Background Music' });
        expect(musicSlider).toHaveValue('45');
        expect(musicSlider).not.toBeDisabled();
        fireEvent.change(musicSlider, { target: { value: '80' } });
        expect(onChangeMusicVolume).toHaveBeenCalledWith(0.8);

        const soundGroup = screen.getByRole('radiogroup', { name: 'Sound Effects' });
        fireEvent.click(soundGroup.querySelector('input[value="false"]'));
        expect(onChangeSoundEnabled).toHaveBeenCalledWith(false);

        const soundSlider = screen.getByRole('slider', { name: 'Volume: Sound Effects' });
        expect(soundSlider).toHaveValue('65');
        expect(soundSlider).not.toBeDisabled();
        fireEvent.change(soundSlider, { target: { value: '30' } });
        expect(onChangeSoundVolume).toHaveBeenCalledWith(0.3);

        rerender(
            <SettingsPanel
                theme="dark"
                language="en"
                joinsAllowed={false}
                joinsAutoAccept={false}
                musicEnabled={false}
                musicVolume={0.8}
                soundEnabled={false}
                soundVolume={0.3}
                onChangeTheme={onChangeTheme}
                onChangeLanguage={onChangeLanguage}
                onChangeJoinsAllowed={onChangeJoinsAllowed}
                onChangeJoinsAutoAccept={onChangeJoinsAutoAccept}
                onChangeMusicEnabled={onChangeMusicEnabled}
                onChangeMusicVolume={onChangeMusicVolume}
                onChangeSoundEnabled={onChangeSoundEnabled}
                onChangeSoundVolume={onChangeSoundVolume}
                onOpenGuide={onOpenGuide}
            />,
        );
        expect(screen.getByRole('combobox', { name: 'Joins' })).toHaveValue('disabled');
        expect(screen.getByRole('slider', { name: 'Volume: Background Music' })).toBeDisabled();
        expect(screen.getByRole('slider', { name: 'Volume: Sound Effects' })).toBeDisabled();
        expect(screen.getByText('80%')).toBeInTheDocument();
        expect(screen.getByText('30%')).toBeInTheDocument();

        expect(document.querySelectorAll('#settings-panel svg.settings-icon--legend')).toHaveLength(6);
        expect(document.querySelectorAll('#settings-panel svg.settings-icon--volume')).toHaveLength(2);
        expect(document.querySelectorAll('#settings-panel svg.settings-icon--title')).toHaveLength(1);
        expect(document.querySelectorAll('#settings-panel svg.settings-icon--btn')).toHaveLength(1);
        expect(document.querySelectorAll('#settings-panel svg.settings-icon--option')).toHaveLength(4);

        fireEvent.click(screen.getByRole('button', { name: 'Open Guide' }));
        expect(onOpenGuide).toHaveBeenCalledTimes(1);
    });

    it('renders VariantSelector and DifficultySelector as segmented pills and emits changes', () => {
        const onVariantChange = vi.fn();
        const onDiffChange = vi.fn();
        render(
            <>
                <VariantSelector variant="3x3" onChange={onVariantChange} />
                <DifficultySelector difficulty="medium" onChange={onDiffChange} />
            </>,
        );

        fireEvent.click(screen.getByRole('radio', { name: '6×6' }));
        expect(onVariantChange).toHaveBeenCalledWith('2x3');

        fireEvent.click(screen.getByRole('radio', { name: 'Hard' }));
        expect(onDiffChange).toHaveBeenCalledWith('hard');
    });

    it('hides connection/Live Watch Ready chrome in Solo mode and shows variant progress', () => {
        const puzzle = [...SAMPLE_SOLUTION];
        puzzle[0] = 0;
        const gameState = createSudokuGame({ difficulty: 'easy', puzzle, solution: SAMPLE_SOLUTION });

        render(
            <StatusBanner
                connectionStatus="connected"
                mode="solo"
                isSpectating={false}
                myRole="host"
                currentMembers={[]}
                spectatedGameMode={null}
                gameState={gameState}
                onReconnect={vi.fn()}
            />,
        );

        expect(screen.queryByText('Live Watch Ready')).not.toBeInTheDocument();
        expect(document.getElementById('connection-status')).toBeNull();
        expect(document.getElementById('game-status-text')).toHaveTextContent('3×3 Easy • Solo');
        expect(document.getElementById('sudoku-progress')).toHaveTextContent('80/81');
    });

    it('transitions StatusBanner to Co-op with Reconnect and You/Partner legend when a partner joins', () => {
        const puzzle = [...SAMPLE_2X3_SOLUTION];
        puzzle[0] = 0;
        const gameState = createSudokuGame({
            difficulty: 'medium',
            variant: '2x3',
            puzzle,
            solution: SAMPLE_2X3_SOLUTION,
        });
        const onReconnect = vi.fn();

        render(
            <StatusBanner
                connectionStatus="failed"
                mode="solo"
                isSpectating={false}
                myRole="host"
                currentMembers={[
                    { id: '1', role: 'host' },
                    { id: '2', role: 'guest' },
                ]}
                spectatedGameMode={null}
                gameState={gameState}
                onReconnect={onReconnect}
            />,
        );

        expect(document.getElementById('game-status-text')).toHaveTextContent('Co-op • 2×3 Medium');
        expect(document.getElementById('sudoku-progress')).toHaveTextContent('35/36');
        expect(screen.getByText('Partner online')).toBeInTheDocument();
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.getByText('Partner')).toBeInTheDocument();
        const retryBtn = screen.getByRole('button', { name: 'Reconnect' });
        fireEvent.click(retryBtn);
        expect(onReconnect).toHaveBeenCalledTimes(1);
    });

    it('shows plural partner counts in StatusBanner when 3+ players are in Co-op', () => {
        const puzzle = [...SAMPLE_2X3_SOLUTION];
        puzzle[0] = 0;
        const gameState = createSudokuGame({
            difficulty: 'medium',
            variant: '2x3',
            puzzle,
            solution: SAMPLE_2X3_SOLUTION,
        });

        const { rerender } = render(
            <StatusBanner
                connectionStatus="connected"
                mode="online"
                isSpectating={false}
                myRole="guest"
                myClientId="g1"
                currentMembers={[
                    { id: 'h1', role: 'host' },
                    { id: 'g1', role: 'guest' },
                    { id: 'g2', role: 'guest' },
                ]}
                spectatedGameMode={null}
                gameState={gameState}
                onReconnect={vi.fn()}
            />,
        );

        expect(screen.getByText('2 Partners online')).toBeInTheDocument();

        rerender(
            <StatusBanner
                connectionStatus="connected"
                mode="watch"
                isSpectating
                myRole="spectator"
                myClientId="s1"
                currentMembers={[
                    { id: 'h1', role: 'host' },
                    { id: 'g1', role: 'guest' },
                    { id: 'g2', role: 'guest' },
                ]}
                spectatedGameMode="online"
                gameState={gameState}
                onReconnect={vi.fn()}
            />,
        );

        expect(screen.getByText('Host: Online | Partners: 2 Online')).toBeInTheDocument();
    });

    it('disables completed digits outside notes mode and renders 6 digits for 2x3 in PlayerControls', () => {
        const puzzle = [...SAMPLE_SOLUTION];
        puzzle[0] = 0; // Digit 5 has 8 remaining; all other digits 1..4,6..9 have 9 placed (complete)

        const { rerender } = render(
            <PlayerControls
                board={puzzle}
                notesMode={false}
                canUndo={false}
                activeDigit={5}
                isSolved={false}
                onUndo={vi.fn()}
                onErase={vi.fn()}
                onToggleNotes={vi.fn()}
                onLocalHint={vi.fn()}
                onDigit={vi.fn()}
            />,
        );

        const btn1 = screen.getByRole('button', { name: '1, all 9 placed' });
        const btn5 = screen.getByRole('button', { name: 'Enter 5, 1 remaining' });

        expect(btn1).toBeDisabled();
        expect(btn5).not.toBeDisabled();
        expect(btn5).toHaveClass('numpad-btn--active');
        expect(btn5).toHaveAttribute('aria-pressed', 'true');

        const puzzle2x3 = [...SAMPLE_2X3_SOLUTION];
        puzzle2x3[0] = 0;
        rerender(
            <PlayerControls
                board={puzzle2x3}
                variant="2x3"
                notesMode={false}
                canUndo={false}
                activeDigit={1}
                isSolved={false}
                onUndo={vi.fn()}
                onErase={vi.fn()}
                onToggleNotes={vi.fn()}
                onLocalHint={vi.fn()}
                onDigit={vi.fn()}
            />,
        );

        expect(document.querySelectorAll('.numpad .numpad-btn')).toHaveLength(6);
        expect(screen.getByRole('button', { name: 'Enter 1, 1 remaining' })).not.toBeDisabled();
        expect(screen.getByRole('button', { name: '2, all 6 placed' })).toBeDisabled();
    });

    it('supports 9-digit and 6-digit spectator pads and disables digits when a filled cell is selected', () => {
        const puzzle = [...SAMPLE_SOLUTION];
        puzzle[0] = 0;

        const { rerender } = render(
            <WatcherInteractions
                selectedIndex={0}
                board={puzzle}
                onSendHint={vi.fn()}
                onSendReaction={vi.fn()}
            />,
        );

        expect(document.querySelectorAll('.spectator-pad__digits .spectator-pad__btn')).toHaveLength(9);
        expect(screen.getByRole('button', { name: 'Suggest digit 5' })).not.toBeDisabled();

        rerender(
            <WatcherInteractions
                selectedIndex={1}
                board={puzzle}
                onSendHint={vi.fn()}
                onSendReaction={vi.fn()}
            />,
        );
        expect(screen.getByRole('button', { name: 'Suggest digit 5' })).toBeDisabled();

        const puzzle2x3 = [...SAMPLE_2X3_SOLUTION];
        puzzle2x3[0] = 0;
        rerender(
            <WatcherInteractions
                selectedIndex={0}
                board={puzzle2x3}
                variant="2x3"
                onSendHint={vi.fn()}
                onSendReaction={vi.fn()}
            />,
        );
        expect(document.querySelectorAll('.spectator-pad__digits .spectator-pad__btn')).toHaveLength(6);
    });

    it('opens localized touch-first HelpDialog and closes on Escape key, and renders SolveSummary CTA', () => {
        const onClose = vi.fn();
        const onPlayAgain = vi.fn();

        const { rerender } = render(
            <>
                <HelpDialog isOpen onClose={onClose} />
                <SolveSummary
                    difficulty="hard"
                    elapsedSeconds={125}
                    mode="online"
                    isSpectating={false}
                    restartLabel="New Puzzle"
                    restartDisabled={false}
                    onPlayAgain={onPlayAgain}
                />
            </>,
        );

        expect(screen.getByRole('dialog', { name: 'Game Guide' })).toBeInTheDocument();
        expect(screen.getByText('Tap to Enter Numbers')).toBeInTheDocument();
        expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
        expect(screen.queryByText(/Arrow keys/i)).not.toBeInTheDocument();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);

        expect(screen.getByText('Hard Co-op finished in 02:05')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
        expect(onPlayAgain).toHaveBeenCalledTimes(1);

        rerender(<HelpDialog isOpen onClose={onClose} messages={deMessages} />);
        expect(screen.getByRole('dialog', { name: 'Spielanleitung' })).toBeInTheDocument();
        expect(screen.getByText('Zahlen per Tipp eingeben')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument();
    });

    it('persists and restores Solo puzzle progress in localStorage', () => {
        const puzzle = [...SAMPLE_SOLUTION];
        puzzle[0] = 0;
        let state = createSudokuGame({ difficulty: 'hard', puzzle, solution: SAMPLE_SOLUTION });
        state = setCellValue(state, 0, 5);
        state.elapsedSeconds = 42;

        saveSoloGameSnapshot(state, 'solo-room-1');
        const loaded = loadSoloGameSnapshot();
        expect(loaded.roomId).toBe('solo-room-1');
        expect(loaded.gameState.board[0]).toBe(5);
        expect(loaded.gameState.elapsedSeconds).toBe(42);

        clearSoloGameSnapshot();
        expect(loadSoloGameSnapshot()).toBeNull();
    });

    it('highlights matched numpad digit and exposes Fill Candidates / Clear Notes when notesMode is active', () => {
        const puzzle = [...SAMPLE_SOLUTION];
        puzzle[0] = 0;
        const onFillCandidates = vi.fn();
        const onClearNotes = vi.fn();

        render(
            <PlayerControls
                board={puzzle}
                notesMode
                canUndo
                activeDigit={null}
                highlightedDigit={5}
                isSolved={false}
                onUndo={vi.fn()}
                onErase={vi.fn()}
                onToggleNotes={vi.fn()}
                onFillCandidates={onFillCandidates}
                onClearNotes={onClearNotes}
                onLocalHint={vi.fn()}
                onDigit={vi.fn()}
            />,
        );

        expect(screen.getByRole('button', { name: 'Enter 5, 1 remaining' })).toHaveClass('numpad-btn--matched');

        fireEvent.click(screen.getByRole('button', { name: 'Fill Candidates' }));
        expect(onFillCandidates).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole('button', { name: 'Clear Notes' }));
        expect(onClearNotes).toHaveBeenCalledTimes(1);
    });

    it('supports portrait and landscape orientations in iOS and PWA app configuration', () => {
        const root = process.cwd();
        const infoPlist = fs.readFileSync(path.join(root, 'ios/App/App/Info.plist'), 'utf8');
        const appDelegate = fs.readFileSync(path.join(root, 'ios/App/App/AppDelegate.swift'), 'utf8');
        const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/manifest.webmanifest'), 'utf8'));

        expect(infoPlist).toContain('UIInterfaceOrientationPortrait');
        expect(infoPlist).toContain('UIInterfaceOrientationLandscapeLeft');
        expect(infoPlist).toContain('UIInterfaceOrientationLandscapeRight');
        expect(infoPlist).toMatch(/<key>UIRequiresFullScreen<\/key>\s*<false\/>/);

        expect(appDelegate).toMatch(/supportedInterfaceOrientationsFor[\s\S]*return .*\.(allButUpsideDown|all)/);
        expect(manifest.orientation).toBe('any');
    });

    it('includes responsive landscape, desktop/iPad, and iPhone Duo layout rules in CSS', () => {
        const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/app.css'), 'utf8');
        expect(css).toContain('.gameplay-stage');
        expect(css).toMatch(/@media\s*\(orientation:\s*landscape\)/);
        expect(css).toMatch(/@media\s*\(orientation:\s*landscape\)\s*and\s*\(min-width:\s*900px\)/);
        expect(css).toMatch(/@media\s*\(orientation:\s*landscape\)\s*and\s*\(horizontal-viewport-segments:\s*2\)/);
    });

    it('keeps reveal scrim on artwork cells during hint previews in CSS', () => {
        const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/app.css'), 'utf8');
        expect(css).toMatch(
            /\.sudoku-board--has-artwork:not\(\.sudoku-board--solved\)\s+\.sudoku-cell--revealed\.sudoku-cell--hint-preview\.sudoku-cell--hint-context[\s\S]*?linear-gradient\(var\(--color-hint-bg\),\s*var\(--color-hint-bg\)\),\s*var\(--color-reveal-scrim\)/,
        );
        expect(css).toMatch(
            /\.sudoku-board--has-artwork:not\(\.sudoku-board--solved\)\s+\.sudoku-cell--revealed\.sudoku-cell--unit-revealed\.sudoku-cell--hint-preview\.sudoku-cell--hint-context[\s\S]*?linear-gradient\(var\(--color-hint-bg\),\s*var\(--color-hint-bg\)\),\s*var\(--color-reveal-unit-scrim\)/,
        );
    });

    it('renders Back alongside Play Again in SolveSummary', () => {
        const onPlayAgain = vi.fn();
        const onBackToSetup = vi.fn();

        render(
            <SolveSummary
                difficulty="medium"
                elapsedSeconds={90}
                mode="online"
                isSpectating={false}
                restartLabel="New Puzzle"
                restartDisabled={false}
                onPlayAgain={onPlayAgain}
                onBackToSetup={onBackToSetup}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Back' }));
        expect(onBackToSetup).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Play Again' })).toBeInTheDocument();
    });

    it('offers Continue Solo in StatusBanner only when co-op partner is disconnected', () => {
        const puzzle = [...SAMPLE_2X3_SOLUTION];
        puzzle[0] = 0;
        const gameState = createSudokuGame({
            difficulty: 'medium',
            variant: '2x3',
            puzzle,
            solution: SAMPLE_2X3_SOLUTION,
        });
        const onContinueSolo = vi.fn();

        const { rerender } = render(
            <StatusBanner
                connectionStatus="connected"
                mode="online"
                isSpectating={false}
                myRole="guest"
                myClientId="guest-1"
                currentMembers={[{ id: 'guest-1', role: 'guest' }]}
                spectatedGameMode={null}
                gameState={gameState}
                onReconnect={vi.fn()}
                onContinueSolo={onContinueSolo}
            />,
        );

        expect(screen.getByText('Partner disconnected')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Continue Solo' }));
        expect(onContinueSolo).toHaveBeenCalledTimes(1);

        rerender(
            <StatusBanner
                connectionStatus="connected"
                mode="online"
                isSpectating={false}
                myRole="guest"
                myClientId="guest-1"
                currentMembers={[
                    { id: 'host-1', role: 'host' },
                    { id: 'guest-1', role: 'guest' },
                ]}
                spectatedGameMode={null}
                gameState={gameState}
                onReconnect={vi.fn()}
                onContinueSolo={onContinueSolo}
            />,
        );

        expect(screen.queryByRole('button', { name: 'Continue Solo' })).not.toBeInTheDocument();
    });
});
