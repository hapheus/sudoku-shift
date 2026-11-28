import React from 'react';
import { Button } from 'framework7-react';
import { APP_STORE_URL, getPlayStoreUrl } from '../utils/app-routing.js';
import { DifficultySelector } from './DifficultySelector.jsx';
import { VariantSelector } from './VariantSelector.jsx';

const APPLE_LOGO_PATH = 'M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z';
const PLAY_STORE_LOGO_PATH = 'M3.609 1.814L13.792 12 3.61 22.186a1.75 1.75 0 0 1-.61-1.34V3.154c0-.517.224-.998.609-1.34zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z';

export function SetupView({
    variant,
    difficulty,
    canResumeGame,
    isNativeApp,
    landscapeArtwork = null,
    onVariantChange,
    onDifficultyChange,
    onPlay,
    onResume,
    onOpenLegalPage,
    messages,
}) {
    const playStoreUrl = getPlayStoreUrl();
    return (
        <section id="play-setup" className="play-setup split-layout" aria-label={messages.setupTitle}>
            <div className="split-region split-region--primary">
                <header className="play-setup__header f7-large-header">
                    <h1 className="play-setup__title">{messages.gameTitle}</h1>
                    {messages.splashTagline && (
                        <p className="play-setup__tagline">{messages.splashTagline}</p>
                    )}
                </header>
                {landscapeArtwork && (
                    <div className="setup-enamel-tray" aria-hidden="true">
                        <img
                            src={landscapeArtwork.src}
                            alt=""
                            className="setup-enamel-tray__artwork"
                            decoding="async"
                        />
                    </div>
                )}
            </div>
            <div className="split-region split-region--secondary">
                <div className="setup-controls f7-inset-card">
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
                    <Button
                        type="button"
                        id="start-game-btn"
                        fill
                        large
                        className="btn-primary play-setup__cta"
                        onClick={onPlay}
                    >
                        {messages.startPuzzle}
                    </Button>
                    {canResumeGame && (
                        <Button
                            type="button"
                            id="resume-game-btn"
                            tonal
                            large
                            className="btn-secondary play-setup__resume"
                            onClick={onResume}
                        >
                            {messages.resumePuzzle}
                        </Button>
                    )}
                </div>

                {!isNativeApp && (
                    <footer id="web-start-footer" className="play-setup__web-footer" aria-label={messages.webFooterLabel}>
                        <div className="store-links">
                            <a
                                id="app-store-link"
                                className="app-store-link button button-outline button-round"
                                href={APP_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d={APPLE_LOGO_PATH} />
                                </svg>
                                <span>{messages.appStoreLinkLabel}</span>
                            </a>
                            {playStoreUrl ? (
                                <a
                                    id="play-store-link"
                                    className="app-store-link button button-outline button-round"
                                    href={playStoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d={PLAY_STORE_LOGO_PATH} />
                                    </svg>
                                    <span>{messages.playStoreLinkLabel}</span>
                                </a>
                            ) : (
                                <span
                                    id="play-store-link"
                                    className="app-store-link app-store-link--coming-soon button button-outline button-round"
                                    aria-disabled="true"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d={PLAY_STORE_LOGO_PATH} />
                                    </svg>
                                    <span>{messages.playStoreLinkLabel}</span>
                                    <span className="store-badge-tag">{messages.comingSoonLabel}</span>
                                </span>
                            )}
                        </div>
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
