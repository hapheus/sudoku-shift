import { ghostSwapGroups } from '../domain/night-ghost.js';
import { NightGhost } from './NightGhost.jsx';
import React from 'react';
import { getCellCoords, getColLabel, getVariantSpec, inferVariantFromBoardLength } from '../domain/sudoku-generator.js';
import { getUnitsForVariant } from '../domain/sudoku-variants.js';
import { getSudokuCellAriaLabel } from '../utils/aria-helpers.js';

function getCompletedUnitCells(gameState, spec, hasArtwork, conflictSet) {
    const completedUnitCells = new Set();
    if (hasArtwork && Array.isArray(gameState.board) && gameState.board.length === spec.totalCells) {
        for (const { indices } of getUnitsForVariant(spec)) {
            if (indices.every(index => gameState.board[index] > 0 && !conflictSet.has(index))) {
                for (const index of indices) completedUnitCells.add(index);
            }
        }
    }

    return completedUnitCells;
}

function isPartnerCell(owner, myRole, isGiven, value) {
    if (isGiven || value <= 0 || !owner) return false;
    if (myRole === 'spectator') return owner === 'guest';
    return (myRole === 'host' || myRole === 'guest') && owner !== myRole;
}

function cellAnimationStyle(celebrateDelay, r, c, hasArtwork, isSolved) {
    const style = {};
    if (celebrateDelay !== undefined) style['--complete-delay'] = `${celebrateDelay}ms`;
    if (hasArtwork && isSolved) style['--solve-delay'] = `${(r + c) * 42}ms`;
    return style;
}

function isFocusPeer(coords, focusCoords, isFocusAnchor) {
    if (!focusCoords || isFocusAnchor) return false;
    return coords.row === focusCoords.row || coords.col === focusCoords.col || coords.box === focusCoords.box;
}

function ownershipClasses(isGiven, value, isPartnerOwned) {
    return {
        'sudoku-cell--given': isGiven,
        'sudoku-cell--partner': !isGiven && value > 0 && isPartnerOwned,
        'sudoku-cell--user': !isGiven && value > 0 && !isPartnerOwned,
    };
}

function ghostGroupAttribute(row, col, groups) {
    if (!groups) return undefined;
    const { axis, size, from, to } = groups;
    const group = Math.floor((axis === 'band' ? row : col) / size);
    return group === from || group === to ? true : undefined;
}

export const SudokuBoard = React.memo(function SudokuBoard({
    gameState,
    selectedIndex,
    activeDigit = null,
    hintsByCell,
    floatingReactions,
    cellRefs,
    onCellSelect,
    myRole = null,
    playerCursorIndex = null,
    partnerCursorIndex = null,
    partnerCursorIndices = null,
    unitCelebration = null,
    hintHighlight = null,
    fistBump = null,
    nightGhost = null,
    boardBackground = null,
    messages = null,
}) {
    const variant = gameState.variant || inferVariantFromBoardLength(gameState.board?.length);
    const spec = getVariantSpec(variant);
    const { gridSize, boxRows, boxCols, maxDigit } = spec;
    const is6x6 = gridSize === 6;
    const ghostGroups = nightGhost && { ...ghostSwapGroups(nightGhost.swap, spec), axis: nightGhost.swap.axis };

    const focusAnchorIndex = selectedIndex !== null ? selectedIndex : playerCursorIndex;
    const focusCoords = focusAnchorIndex !== null ? getCellCoords(focusAnchorIndex, spec.id) : null;
    const focusValue = focusAnchorIndex !== null ? gameState.board[focusAnchorIndex] : 0;
    const highlightedDigit = focusValue > 0 ? focusValue : (activeDigit || 0);
    const partnerCursorSet = new Set(Array.isArray(partnerCursorIndices) ? partnerCursorIndices : []);
    if (partnerCursorIndex !== null && partnerCursorIndex !== undefined) {
        partnerCursorSet.add(partnerCursorIndex);
    }
    const conflictSet = new Set(gameState.conflicts || []);
    const activeTabStop = selectedIndex !== null && selectedIndex < spec.totalCells ? selectedIndex : 0;
    const isSolved = gameState.status === 'solved';
    const hasArtwork = Boolean(boardBackground?.src);
    const celebrationId = unitCelebration?.id || 0;
    const celebrationDelays = unitCelebration?.cellDelays || null;
    const hintHighlightId = hintHighlight?.id || 0;
    const hintHighlightMode = hintHighlight?.mode || 'solve';
    const isHintPreview = hintHighlightMode === 'preview';
    const hintHighlightTarget = hintHighlight?.targetIndex ?? null;
    const hintHighlightDelays = hintHighlight?.contextDelays || null;

    const completedUnitCells = getCompletedUnitCells(gameState, spec, hasArtwork, conflictSet);

    const digitsList = Array.from({ length: maxDigit }, (_, i) => i + 1);
    const axisIndices = Array.from({ length: gridSize }, (_, i) => i + 1);

    return (
        <div id="game-panel" className="board-wrapper">
            <div id="reaction-stage" className="reaction-stage" aria-live="polite" aria-atomic="false">
                {floatingReactions.map((item) => (
                    <span
                        key={item.id}
                        className="floating-emoji"
                        aria-hidden="true"
                        style={{ left: `${item.left}%` }}
                    >
                        {item.emoji}
                    </span>
                ))}
            </div>

            <div className="board-frame board-tray">
                <div className={`board-col-axes ${is6x6 ? 'board-col-axes--6x6' : ''}`} aria-hidden="true">
                    {axisIndices.map((col) => (
                        <span key={col} className="board-axis-label">{getColLabel(col - 1)}</span>
                    ))}
                </div>

                <div className="board-main-row">
                    <div className={`board-row-axes ${is6x6 ? 'board-row-axes--6x6' : ''}`} aria-hidden="true">
                        {axisIndices.map((row) => (
                            <span key={row} className="board-axis-label">{String(row)}</span>
                        ))}
                    </div>

                    <div
                        id="sudoku-board"
                        className={[
                            'sudoku-board',
                            is6x6 ? 'sudoku-board--6x6' : '',
                            hasArtwork ? 'sudoku-board--has-artwork' : '',
                            isSolved ? 'sudoku-board--solved' : '',
                        ].filter(Boolean).join(' ')}
                        data-night-ghost-phase={nightGhost?.phase}
                        role="grid"
                        aria-label={(messages?.sudokuGridAria || '{gridSize} by {gridSize} Sudoku grid').replaceAll('{gridSize}', String(gridSize))}
                    >
                        {nightGhost && <NightGhost appearance={nightGhost} spec={spec} />}
                        {hasArtwork && (
                            <div className="sudoku-board__artwork" aria-hidden="true">
                                <img
                                    src={boardBackground.src}
                                    alt=""
                                    className="sudoku-board__artwork-img"
                                    decoding="async"
                                    draggable={false}
                                />
                            </div>
                        )}
                        {Array.from({ length: gridSize }, (_, r) => (
                            <div key={r} className={`sudoku-row ${is6x6 ? 'sudoku-row--6x6' : ''}`} role="row">
                                {Array.from({ length: gridSize }, (_, c) => {
                                    const idx = r * gridSize + c;
                                    const value = gameState.board[idx];
                                    const isGiven = Boolean(gameState.givens[idx]);
                                    const isSelected = idx === selectedIndex;
                                    const isConflict = conflictSet.has(idx);
                                    const isRevealed = hasArtwork && value > 0 && !isConflict;
                                    const isUnitRevealed = isRevealed && completedUnitCells.has(idx);
                                    const cellNotes = gameState.notes[idx] || [];
                                    const coords = getCellCoords(idx, spec.id);
                                    const hint = value === 0 ? (hintsByCell.get(idx) || null) : null;

                                    const owner = gameState.cellOwners?.[idx] || null;
                                    const isPartnerOwned = isPartnerCell(owner, myRole, isGiven, value);
                                    const isPlayerFocused = playerCursorIndex === idx;
                                    const isPartnerFocused = partnerCursorSet.has(idx);

                                    const isFocusAnchor = isSelected || (selectedIndex === null && isPlayerFocused);
                                    const isPeer = isFocusPeer(coords, focusCoords, isFocusAnchor);
                                    const isSameDigit = highlightedDigit > 0 && value === highlightedDigit && !isFocusAnchor;

                                    const isBoxRight = (c + 1) % boxCols === 0 && c < gridSize - 1;
                                    const isBoxBottom = (r + 1) % boxRows === 0 && r < gridSize - 1;
                                    const celebrateDelay = celebrationDelays?.get(idx);
                                    const isUnitCelebrating = celebrateDelay !== undefined;
                                    const hintDelay = hintHighlightDelays?.get(idx);
                                    const isHintTarget = hintHighlightTarget === idx && hintDelay !== undefined;
                                    const isHintContext = hintDelay !== undefined && !isHintTarget;
                                    const isFistBumpCell = fistBump?.index === idx;

                                    const cellStyle = cellAnimationStyle(celebrateDelay, r, c, hasArtwork, isSolved);

                                    const cellClasses = {
                                        'sudoku-cell': true,
                                        ...ownershipClasses(isGiven, value, isPartnerOwned),
                                        'sudoku-cell--revealed': isRevealed,
                                        'sudoku-cell--unit-revealed': isUnitRevealed,
                                        'sudoku-cell--selected': isSelected,
                                        'sudoku-cell--player-cursor': isPlayerFocused,
                                        'sudoku-cell--partner-cursor': isPartnerFocused,
                                        'sudoku-cell--peer': isPeer,
                                        'sudoku-cell--same-digit': isSameDigit,
                                        'sudoku-cell--conflict': isConflict,
                                        'sudoku-cell--hinted': hint,
                                        'sudoku-cell--unit-complete': isUnitCelebrating,
                                        'sudoku-cell--hint-target': isHintTarget,
                                        'sudoku-cell--hint-context': isHintContext,
                                        'sudoku-cell--hint-preview': (isHintTarget || isHintContext) && isHintPreview,
                                        'sudoku-cell--fist-bump': isFistBumpCell,
                                        'sudoku-cell--box-right': isBoxRight,
                                        'sudoku-cell--box-bottom': isBoxBottom,
                                    };
                                    const classNames = Object.keys(cellClasses).filter(name => cellClasses[name]).join(' ');

                                    return (
                                        <button
                                            key={idx}
                                            ref={(el) => {
                                                if (cellRefs?.current) {
                                                    cellRefs.current[idx] = el;
                                                }
                                            }}
                                            type="button"
                                            className={classNames}
                                            role="gridcell"
                                            tabIndex={idx === activeTabStop ? 0 : -1}
                                            data-index={idx}
                                            data-night-ghost-group={ghostGroupAttribute(r, c, ghostGroups)}
                                            style={Object.keys(cellStyle).length > 0 ? cellStyle : undefined}
                                            aria-selected={isSelected}
                                            aria-invalid={isConflict ? 'true' : undefined}
                                            aria-label={getSudokuCellAriaLabel(idx, value, {
                                                variant: spec.id,
                                                isGiven,
                                                isConflict,
                                                notes: cellNotes,
                                                hint,
                                                isPartnerOwned,
                                                isPartnerFocused,
                                                isPlayerFocused,
                                                messages,
                                            })}
                                            onClick={() => onCellSelect(idx)}
                                        >
                                            {isUnitCelebrating && (
                                                <span
                                                    key={`celebrate-${celebrationId}`}
                                                    className="sudoku-cell__celebrate"
                                                    style={{ '--complete-delay': `${celebrateDelay}ms` }}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            {(isHintTarget || isHintContext) && (
                                                <span
                                                    key={`hint-hl-${hintHighlightId}-${hintHighlightMode}`}
                                                    className={isHintTarget ? 'sudoku-cell__hint-flash sudoku-cell__hint-flash--target' : 'sudoku-cell__hint-flash'}
                                                    style={{ '--hint-delay': `${hintDelay}ms` }}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            {isFistBumpCell && (
                                                <span
                                                    key={`fist-bump-${fistBump.id}`}
                                                    className={`sudoku-cell__fist-bump ${r === 0 ? 'sudoku-cell__fist-bump--below' : ''}`}
                                                    aria-hidden="true"
                                                >
                                                    <span className="sudoku-cell__fist-bump-emoji">🤜🤛</span>
                                                    <span className="sudoku-cell__fist-bump-text">
                                                        {messages?.[fistBump.phraseKey] || 'Awesome!'}
                                                    </span>
                                                </span>
                                            )}
                                            {value >= 1 && value <= maxDigit ? (
                                                <span className="sudoku-cell__digit">{value}</span>
                                            ) : (
                                                <>
                                                    {cellNotes.length > 0 && (
                                                        <span
                                                            className={`sudoku-cell__notes ${is6x6 ? 'sudoku-cell__notes--2x3' : ''}`}
                                                            aria-hidden="true"
                                                        >
                                                            {digitsList.map((d) => {
                                                                const hasNote = cellNotes.includes(d);
                                                                const isMatchedNote = hasNote && highlightedDigit === d;
                                                                return (
                                                                    <span
                                                                        key={d}
                                                                        className={`sudoku-cell__note ${isMatchedNote ? 'sudoku-cell__note--match' : ''}`}
                                                                    >
                                                                        {hasNote ? `${d} ` : ''}
                                                                    </span>
                                                                );
                                                            })}
                                                        </span>
                                                    )}
                                                    {hint && (
                                                        <span className="sudoku-cell__hint-badge" aria-hidden="true">
                                                            {hint.topValue || '?'}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            {isPlayerFocused && (
                                                <span className="sudoku-cell__player-pip" aria-hidden="true" />
                                            )}
                                            {isPartnerFocused && (
                                                <span className="sudoku-cell__partner-pip" aria-hidden="true" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});
