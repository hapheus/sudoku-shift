import React from 'react';

function SvgIcon({ className = '', children }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

export function IconContrast({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18" />
            <path d="M12 8l5.2-3" />
            <path d="M12 12l6-3.5" />
            <path d="M12 16l5.2-3" />
        </SvgIcon>
    );
}

export function IconMoon({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </SvgIcon>
    );
}

export function IconSun({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </SvgIcon>
    );
}

export function IconGlobe({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a13.5 13.5 0 0 0 0 18 13.5 13.5 0 0 0 0-18" />
            <path d="M3 12h18" />
        </SvgIcon>
    );
}

export function IconUsers({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </SvgIcon>
    );
}

export function IconUserCheck({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
        </SvgIcon>
    );
}

export function IconCheck({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <polyline points="20 6 9 17 4 12" />
        </SvgIcon>
    );
}

export function IconX({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </SvgIcon>
    );
}

export function IconMusic({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </SvgIcon>
    );
}

export function IconAudioLines({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M2 12h2" />
            <path d="M6 8v8" />
            <path d="M10 5v14" />
            <path d="M14 8v8" />
            <path d="M18 10v4" />
            <path d="M22 12h-2" />
        </SvgIcon>
    );
}

export function IconVolume2({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </SvgIcon>
    );
}

export function IconVolume1({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </SvgIcon>
    );
}

export function IconVolumeX({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
        </SvgIcon>
    );
}

export function IconBookOpen({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </SvgIcon>
    );
}

export function IconHelpCircle({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
        </SvgIcon>
    );
}

export function IconArrowUp({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
        </SvgIcon>
    );
}

export function IconArrowDown({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
        </SvgIcon>
    );
}

export function IconArrowLeft({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
        </SvgIcon>
    );
}

export function IconArrowRight({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </SvgIcon>
    );
}

export function IconSearch({ className = '' }) {
    return (
        <SvgIcon className={className}>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
        </SvgIcon>
    );
}
