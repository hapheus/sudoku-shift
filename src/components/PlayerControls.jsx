import React from 'react';
import { KONAMI_BUTTON_LABELS } from '../domain/konami-code.js';
import { getDigitCounts } from '../domain/sudoku-engine.js';
import { getVariantSpec, inferVariantFromBoardLength } from '../domain/sudoku-generator.js';
import enMessages from '../locales/en.json';

function handleToolbarKeyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = Array.from(event.currentTarget.querySelectorAll('button:not(:disabled)'));
    const currentIndex = buttons.indexOf(document.activeElement);
    if (buttons.length < 2 || currentIndex === -1) return;
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % buttons.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = buttons.length - 1;
    event.preventDefault();
    event.stopPropagation();
    buttons[nextIndex]?.focus();
}

export const PlayerControls = React.memo(function PlayerControls({
    board,
    variant = null,
    notesMode,
    canUndo,
    activeDigit = null,
    highlightedDigit = null,
    isSolved = false,
    isHintArmed = false,
    canShift = false,
    konamiPhase = 'arrows',
    isRetroMode = false,
    retroYear = new Date().getFullYear(),
    onUndo,
    onErase,
    onToggleNotes,
    onFillCandidates,
    onClearNotes,
    onLocalHint,
    onShiftRow = null,
    onShiftCol = null,
    onKonamiButton = null,
    onExitRetro = null,
    onDigit,
    messages = enMessages,
}) {
    const resolvedVariant = variant || inferVariantFromBoardLength(board?.length);
    const { maxDigit, gridSize } = getVariantSpec(resolvedVariant);
    const counts = getDigitCounts(board, resolvedVariant);
    const digits = Array.from({ length: maxDigit }, (_, i) => i + 1);
    let shiftBarLabelText = messages.shiftLabel || 'Shift';
    if (isRetroMode) {
        shiftBarLabelText = messages.retroLabel || '1981';
    } else if (konamiPhase === 'ab') {
        shiftBarLabelText = messages.konamiAbPrompt || 'Code';
    }

    const renderShiftActions = () => {
        if (isRetroMode) {
            return (
                <button
                    type="button"
                    id="retro-exit-btn"
                    className="shift-btn shift-btn--retro-exit"
                    onClick={() => onExitRetro?.()}
                >
                    {(messages.retroBackToYear || 'Back to {year}').replace('{year}', String(retroYear))}
                </button>
            );
        }
        if (konamiPhase === 'ab') {
            return KONAMI_BUTTON_LABELS.map((letter) => (
                <button
                    key={letter}
                    type="button"
                    id={`konami-btn-${letter.toLowerCase()}`}
                    className="shift-btn shift-btn--konami"
                    onClick={() => onKonamiButton?.(letter)}
                >
                    {letter}
                </button>
            ));
        }
        return (
            <>
                <button
                    type="button"
                    id="shift-row-up-btn"
                    className="shift-btn"
                    disabled={!canShift || isSolved}
                    aria-label={messages.shiftRowUp || 'Shift row up'}
                    title={`${messages.shiftRowUp || 'Shift row up'} (Shift + ↑)`}
                    onClick={() => onShiftRow?.(-1)}
                >
                    ↑
                </button>
                <button
                    type="button"
                    id="shift-row-down-btn"
                    className="shift-btn"
                    disabled={!canShift || isSolved}
                    aria-label={messages.shiftRowDown || 'Shift row down'}
                    title={`${messages.shiftRowDown || 'Shift row down'} (Shift + ↓)`}
                    onClick={() => onShiftRow?.(1)}
                >
                    ↓
                </button>
                <button
                    type="button"
                    id="shift-col-left-btn"
                    className="shift-btn"
                    disabled={!canShift || isSolved}
                    aria-label={messages.shiftColLeft || 'Shift column left'}
                    title={`${messages.shiftColLeft || 'Shift column left'} (Shift + ←)`}
                    onClick={() => onShiftCol?.(-1)}
                >
                    ←
                </button>
                <button
                    type="button"
                    id="shift-col-right-btn"
                    className="shift-btn"
                    disabled={!canShift || isSolved}
                    aria-label={messages.shiftColRight || 'Shift column right'}
                    title={`${messages.shiftColRight || 'Shift column right'} (Shift + →)`}
                    onClick={() => onShiftCol?.(1)}
                >
                    →
                </button>
            </>
        );
    };

    return (
        <section id="player-controls" className="player-controls" aria-label={messages.puzzleControlsLabel || 'Puzzle Controls'}>
            <div className="tool-bar" role="toolbar" aria-label={messages.cellToolsLabel || 'Cell tools'} onKeyDown={handleToolbarKeyDown}>
                <button
                    type="button"
                    id="undo-btn"
                    className="tool-btn"
                    disabled={!canUndo || isSolved}
                    title={messages.undoTooltip || 'Undo last move (Ctrl/Cmd+Z)'}
                    onClick={onUndo}
                >
                    <span className="tool-btn__content">
                        <svg className="tool-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M9 14L4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
                        </svg>
                        <span>{messages.undo}</span>
                    </span>
                </button>

                <button
                    type="button"
                    id="erase-btn"
                    className="tool-btn"
                    disabled={isSolved}
                    title={messages.eraseTooltip || 'Erase cell (Backspace / Delete / 0)'}
                    onClick={onErase}
                >
                    <span className="tool-btn__content">
                        <svg className="tool-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 20H7L3 16a1 1 0 0 1 0-1.41l9.59-9.59a2 2 0 0 1 2.82 0l5.18 5.18a2 2 0 0 1 0 2.82L13.41 20" />
                        </svg>
                        <span>{messages.erase}</span>
                    </span>
                </button>

                <button
                    type="button"
                    id="notes-btn"
                    className={`tool-btn ${notesMode ? 'tool-btn--active' : ''}`}
                    aria-pressed={notesMode}
                    disabled={isSolved}
                    title={messages.notesTooltip || 'Toggle pencil notes (N)'}
                    onClick={onToggleNotes}
                >
                    <span className="tool-btn__content">
                        <svg className="tool-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                        <span>{notesMode ? messages.notesOn : messages.notes}</span>
                        <kbd className="tool-btn__kbd" aria-hidden="true">N</kbd>
                    </span>
                </button>

                <button
                    type="button"
                    id="hint-btn"
                    className={`tool-btn ${isHintArmed ? 'tool-btn--hint-armed' : ''}`}
                    disabled={isSolved}
                    title={isHintArmed
                        ? (messages.hintTooltipArmed || 'Tap again to fill the highlighted cell')
                        : (messages.hintTooltipIdle || 'Highlight a logically solvable cell')}
                    onClick={onLocalHint}
                >
                    <span className="tool-btn__content">
                        <svg className="tool-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" />
                        </svg>
                        <span>{messages.hint}</span>
                    </span>
                </button>
            </div>

            <div
                className={`numpad ${maxDigit === 6 ? 'numpad--6x6' : ''}`}
                role="group"
                aria-label={(messages.numberPadLabel || 'Number pad 1 to {max}').replace('{max}', String(maxDigit))}
            >
                {digits.map((d) => {
                    const remaining = Math.max(0, gridSize - (counts[d] || 0));
                    const isComplete = remaining === 0;
                    const isDisabled = isSolved || (isComplete && !notesMode);
                    const isActiveDigit = activeDigit === d;
                    const isMatchedDigit = !isActiveDigit && highlightedDigit === d;

                    const digitAriaLabel = isComplete
                        ? (messages.digitCompleteAria || '{digit}, all {gridSize} placed')
                            .replace('{digit}', String(d))
                            .replace('{gridSize}', String(gridSize))
                        : (messages.digitRemainingAria || 'Enter {digit}, {remaining} remaining')
                            .replace('{digit}', String(d))
                            .replace('{remaining}', String(remaining));

                    return (
                        <button
                            key={d}
                            type="button"
                            className={[
                                'numpad-btn',
                                isComplete ? 'numpad-btn--complete' : '',
                                isActiveDigit ? 'numpad-btn--active' : '',
                                isMatchedDigit ? 'numpad-btn--matched' : '',
                            ].filter(Boolean).join(' ')}
                            data-digit={d}
                            disabled={isDisabled}
                            aria-pressed={activeDigit !== null ? isActiveDigit : undefined}
                            aria-label={digitAriaLabel}
                            onClick={() => onDigit(d)}
                        >
                            <span className="numpad-btn__digit">{d}</span>{' '}
                            <span className="numpad-btn__count" aria-hidden="true">
                                {remaining > 0 ? remaining : '✓'}
                            </span>
                        </button>
                    );
                })}
            </div>

            {(onShiftRow || onShiftCol || isRetroMode) && (
                <div
                    className={[
                        'shift-bar',
                        isRetroMode ? 'shift-bar--retro' : '',
                        konamiPhase === 'ab' && !isRetroMode ? 'shift-bar--konami' : '',
                    ].filter(Boolean).join(' ')}
                    role="toolbar"
                    aria-label={
                        isRetroMode
                            ? (messages.retroLabel || '1981')
                            : (messages.shiftToolbarLabel || 'Shift row or column within box')
                    }
                    title={
                        !isRetroMode && konamiPhase !== 'ab' && !canShift
                            ? (messages.shiftHintNoCell || 'Select a cell to shift its row or column within its box')
                            : undefined
                    }
                    onKeyDown={handleToolbarKeyDown}
                >
                    <div className="shift-bar__label-group">
                        <span className="shift-bar__label" aria-hidden="true">
                            {shiftBarLabelText}
                        </span>
                        {!isRetroMode && konamiPhase !== 'ab' && !canShift && !isSolved && (
                            <span className="shift-bar__hint">
                                {messages.shiftHintNoCell || 'Select a cell to shift its row or column within its box'}
                            </span>
                        )}
                    </div>
                    <div className="shift-bar__actions">
                        {renderShiftActions()}
                    </div>
                </div>
            )}

            {notesMode && !isSolved && (onFillCandidates || onClearNotes) && (
                <div className="notes-quick-bar" role="group" aria-label={messages.pencilNoteHelpersLabel || 'Pencil note helpers'}>
                    {onFillCandidates && (
                        <button
                            type="button"
                            id="auto-notes-btn"
                            className="notes-quick-btn"
                            onClick={onFillCandidates}
                        >
                            {messages.fillCandidates}
                        </button>
                    )}
                    {onClearNotes && (
                        <button
                            type="button"
                            id="clear-notes-btn"
                            className="notes-quick-btn notes-quick-btn--muted"
                            onClick={onClearNotes}
                        >
                            {messages.clearNotes}
                        </button>
                    )}
                </div>
            )}
        </section>
    );
});
