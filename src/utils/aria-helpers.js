import { getCellCoords } from '../domain/sudoku-generator.js';

function fillTemplate(template, values) {
    return Object.entries(values).reduce(
        (acc, [key, val]) => acc.replaceAll(`{${key}}`, String(val)),
        template,
    );
}

export function getSudokuCellAriaLabel(index, value, {
    variant = '3x3',
    isGiven = false,
    isConflict = false,
    notes = [],
    hint = null,
    isPartnerOwned = false,
    isPartnerFocused = false,
    isPlayerFocused = false,
    messages = null,
} = {}) {
    const { row, col } = getCellCoords(index, variant);
    const coordTemplate = messages?.cellCoordAria || 'Row {row}, Column {col}';
    const parts = [fillTemplate(coordTemplate, { row: row + 1, col: col + 1 })];

    if (value >= 1 && value <= 9) {
        if (isGiven) {
            parts.push(fillTemplate(messages?.cellGivenAria || 'given {value}', { value }));
        } else if (isPartnerOwned) {
            parts.push(fillTemplate(messages?.cellPartnerAria || '{value} by partner', { value }));
        } else {
            parts.push(`${value}`);
        }
    } else {
        parts.push(messages?.cellEmptyAria || 'empty');
        if (notes && notes.length > 0) {
            parts.push(fillTemplate(messages?.cellNotesAria || 'notes {notes}', { notes: notes.join(', ') }));
        }
    }

    if (isConflict) {
        parts.push(messages?.cellConflictAria || 'conflict');
    }

    if (hint && hint.topValue) {
        parts.push(fillTemplate(messages?.cellSpectatorHintAria || 'spectator hint {value}', { value: hint.topValue }));
    } else if (hint) {
        parts.push(messages?.cellSpectatorNudgeAria || 'spectator nudge');
    }

    if (isPlayerFocused) {
        parts.push(messages?.cellPlayerCursorAria || 'player cursor');
    }

    if (isPartnerFocused) {
        parts.push(messages?.cellPartnerCursorAria || 'partner cursor');
    }

    return parts.join(', ');
}
