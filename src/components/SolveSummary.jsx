import React from 'react';
import enMessages from '../locales/en.json';
import { formatPlayerTag } from '../services/player-name.js';
import { PlayerTag } from './PlayerTag.jsx';

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function SolveSummary({
    difficulty,
    elapsedSeconds,
    mode,
    playerResults = [],
    isSpectating,
    restartLabel,
    restartDisabled,
    onPlayAgain,
    onBackToSetup = null,
    messages = enMessages,
}) {
    const diffMap = {
        easy: messages.diffEasy,
        medium: messages.diffMedium,
        hard: messages.diffHard,
        expert: messages.diffExpert,
    };
    const diffLabel = diffMap[difficulty] || (difficulty
        ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
        : messages.diffMedium);
    const modeLabel = mode === 'online' ? messages.coopLabel : messages.soloLabel;
    const isDefaultNewPuzzle = restartLabel === 'New Puzzle' || restartLabel === messages.newPuzzle;

    return (
        <section id="solve-summary" className="solve-summary" aria-label={messages.puzzleCompletedTitle}>
            <div className="solve-summary__info">
                <h2 className="solve-summary__title">
                    {isSpectating ? messages.puzzleCompletedTitle : messages.puzzleSolvedTitle}
                </h2>
                <p className="solve-summary__meta">
                    {`${diffLabel} ${modeLabel} ${messages.finishedIn} ${formatDuration(elapsedSeconds || 0)}`}
                </p>
            </div>
            {mode === 'online' && playerResults.length > 0 && (
                <table className="solve-summary__results">
                    <caption>{messages.solveContributions}</caption>
                    <thead>
                        <tr>
                            <th scope="col">{messages.solvePlayer}</th>
                            <th scope="col">{messages.solveCells}</th>
                            <th scope="col">{messages.solveHints}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerResults.map(({ id, name, cellsSolved, hintsUsed }) => (
                            <tr key={id}>
                                <th scope="row"><PlayerTag tag={formatPlayerTag(name || messages.solvePlayer, id)} /></th>
                                <td>{cellsSolved}</td>
                                <td>{hintsUsed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {!isSpectating && (
                <div className="solve-summary__actions">
                    <button
                        type="button"
                        className="button button-fill solve-summary__cta"
                        disabled={restartDisabled}
                        onClick={onPlayAgain}
                    >
                        {isDefaultNewPuzzle ? messages.playAgain : restartLabel}
                    </button>
                    {onBackToSetup && (
                        <button
                            type="button"
                            id="solve-setup-btn"
                            className="button button-outline btn-secondary solve-summary__secondary-btn"
                            onClick={onBackToSetup}
                        >
                            {messages.backToSetup || 'Back'}
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
