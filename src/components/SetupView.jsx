import React from 'react';
import { APP_STORE_URL } from '../utils/app-routing.js';
import { DifficultySelector } from './DifficultySelector.jsx';
import { VariantSelector } from './VariantSelector.jsx';

const APPLE_LOGO_PATH = 'M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z';

export function SetupView({
    variant,
    difficulty,
    canResumeGame,
    isNativeApp,
    onVariantChange,
    onDifficultyChange,
    onPlay,
    onResume,
    onOpenLegalPage,
    messages,
}) {
    return (
        <section id="play-setup" className="play-setup split-layout" aria-label={messages.setupTitle}>
            <div className="split-region split-region--primary">
                <header className="play-setup__header">
                    <h1 className="play-setup__title">{messages.gameTitle}</h1>
                </header>
            </div>
            <div className="split-region split-region--secondary">
                <div className="setup-controls">
                    <VariantSelector
                        variant={variant}
                        onChange={onVariantChange}
                        messages={messages}
                    />
                    <DifficultySelector
                        difficulty={difficulty}
                        onChange={onDifficultyChange}
                        messages={messages}
                    />
                </div>

                <div className="play-setup__actions">
                    <button
                        type="button"
                        id="start-game-btn"
                        className="btn-primary play-setup__cta"
                        onClick={onPlay}
                    >
                        {messages.startPuzzle}
                    </button>
                    {canResumeGame && (
                        <button
                            type="button"
                            id="resume-game-btn"
                            className="btn-secondary play-setup__resume"
                            onClick={onResume}
                        >
                            {messages.resumePuzzle}
                        </button>
                    )}
                </div>

                {!isNativeApp && (
                    <footer id="web-start-footer" className="play-setup__web-footer" aria-label={messages.webFooterLabel}>
                        <a
                            id="app-store-link"
                            className="app-store-link"
                            href={APP_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d={APPLE_LOGO_PATH} />
                            </svg>
                            <span>{messages.appStoreLinkLabel}</span>
                        </a>
                        <nav className="web-legal-links" aria-label={messages.legalLinksLabel}>
                            <a
                                id="privacy-link"
                                href="/privacy"
                                className="web-legal-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onOpenLegalPage('privacy');
                                }}
                            >
                                {messages.privacyTitle}
                            </a>
                            <span className="web-legal-links__sep" aria-hidden="true">·</span>
                            <a
                                id="impressum-link"
                                href="/impressum"
                                className="web-legal-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onOpenLegalPage('impressum');
                                }}
                            >
                                {messages.impressumTitle}
                            </a>
                        </nav>
                    </footer>
                )}
            </div>
        </section>
    );
}
