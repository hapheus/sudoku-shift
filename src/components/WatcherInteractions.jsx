import React from 'react';
import { formatCellCoord, getVariantSpec, inferVariantFromBoardLength } from '../domain/sudoku-generator.js';
import { REACTION_LIST } from '../utils/watcher-helpers.js';
import enMessages from '../locales/en.json';

const EMOJI_LABEL_KEYS = {
    '👏': ['spectatorReactionApplause', 'Send applause reaction'],
    '🔥': ['spectatorReactionFire', 'Send fire reaction'],
    '💡': ['spectatorReactionIdea', 'Send lightbulb reaction'],
    '😮': ['spectatorReactionSurprised', 'Send surprised reaction'],
    '😂': ['spectatorReactionLaugh', 'Send laugh reaction'],
    '🎉': ['spectatorReactionCelebrate', 'Send celebration reaction'],
};

export function WatcherInteractions({
    selectedIndex,
    board,
    variant = null,
    onSendHint,
    onSendReaction,
    messages = enMessages,
}) {
    const resolvedVariant = variant || inferVariantFromBoardLength(board?.length);
    const { maxDigit } = getVariantSpec(resolvedVariant);
    const digits = Array.from({ length: maxDigit }, (_, i) => i + 1);

    const canHintSelected = selectedIndex !== null && board[selectedIndex] === 0;
    let hintStatus = (messages.spectatorHintPrompt || 'Tap an empty cell on the board, then suggest 1–{max} or nudge players to inspect it:')
        .replace('{max}', String(maxDigit));
    if (selectedIndex !== null) {
        const cellLabel = formatCellCoord(selectedIndex, resolvedVariant);
        hintStatus = board[selectedIndex] !== 0
            ? (messages.spectatorCellOccupied || '{cell} already has a digit. Select an empty cell to suggest a hint.').replace('{cell}', cellLabel)
            : (messages.spectatorCellSelected || 'Selected {cell} — suggest a digit or nudge players to look here:').replace('{cell}', cellLabel);
    }

    return (
        <section
            id="watcher-interactions"
            className={`watcher-interactions${maxDigit === 6 ? ' watcher-interactions--6x6' : ''}`}
            aria-label={messages.spectatorInteractionsLabel || 'Spectator Interactions'}
        >
            <p id="watcher-hint-status" className="watcher-interactions__hint">
                {hintStatus}
            </p>

            <div className="spectator-pad" role="group" aria-label={messages.spectatorSuggestGroupLabel || 'Suggest a digit hint'}>
                <div className="spectator-pad__digits">
                    {digits.map((d) => (
                        <button
                            key={d}
                            type="button"
                            className="spectator-pad__btn"
                            data-hint-digit={d}
                            aria-label={(messages.spectatorSuggestDigitAria || 'Suggest digit {digit}').replace('{digit}', String(d))}
                            disabled={selectedIndex !== null && !canHintSelected}
                            onClick={() => onSendHint(d)}
                        >
                            {d}
                        </button>
                    ))}
                </div>
                <div className="spectator-pad__actions">
                    <button
                        type="button"
                        id="spectator-nudge-btn"
                        className="spectator-pad__action"
                        title={messages.spectatorNudgeTooltip || 'Draw attention to the selected cell without naming a digit'}
                        onClick={() => onSendHint(null)}
                    >
                        {messages.nudgeCell}
                    </button>
                    <button
                        type="button"
                        id="spectator-clear-hint-btn"
                        className="spectator-pad__action spectator-pad__action--muted"
                        onClick={() => onSendHint(undefined)}
                    >
                        {messages.clearHint}
                    </button>
                </div>
            </div>

            <div className="emoji-bar" role="group" aria-label={messages.spectatorEmojiGroupLabel || 'Send emoji reaction'}>
                {REACTION_LIST.map((emoji) => {
                    const entry = EMOJI_LABEL_KEYS[emoji];
                    const emojiAriaLabel = entry
                        ? (messages[entry[0]] || entry[1])
                        : (messages.spectatorReactionFallback || 'Send {emoji} reaction').replace('{emoji}', emoji);
                    return (
                        <button
                            key={emoji}
                            type="button"
                            className="emoji-btn"
                            data-emoji={emoji}
                            aria-label={emojiAriaLabel}
                            onClick={() => onSendReaction(emoji)}
                        >
                            {emoji}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
