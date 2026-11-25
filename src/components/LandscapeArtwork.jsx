import React from 'react';
import nightGhostArtwork from '../assets/easter-eggs/night-ghost.webp';

const GHOST_ARTWORK = { src: nightGhostArtwork };

export function LandscapeArtwork({ artwork, active = true, side = 'left', hidden = false }) {
    return (
        <div className={`landscape-artwork landscape-artwork--${side}`} hidden={hidden} aria-hidden="true">
            {active && artwork && (
                <img src={artwork.src} alt="" className="landscape-artwork__image" decoding="async" />
            )}
        </div>
    );
}

export function NightGhostArtwork({ nightGhost, side = 'right' }) {
    return <LandscapeArtwork artwork={GHOST_ARTWORK} active={Boolean(nightGhost)} side={side} hidden={!nightGhost} />;
}
