import React, { useLayoutEffect, useRef, useState } from 'react';
import enMessages from '../locales/en.json';

export function BottomNav({
    activeTab,
    onSelectTab,
    isWatchActive = false,
    messages = enMessages,
}) {
    const tabList = useRef(null);
    const tabRefs = useRef([]);
    const [compact, setCompact] = useState(false);

    useLayoutEffect(() => {
        if (!window.ResizeObserver) return undefined;
        const tabs = [...tabList.current.querySelectorAll('.bottom-nav__item')];
        const labels = tabs.map(tab => tab.querySelector('.bottom-nav__label'));
        const update = () => {
            setCompact(tabs.some((tab, index) => {
                const { paddingLeft, paddingRight } = window.getComputedStyle(tab);
                const availableWidth = tab.getBoundingClientRect().width - parseFloat(paddingLeft) - parseFloat(paddingRight);
                return labels[index].getBoundingClientRect().width > availableWidth;
            }));
        };
        const observer = new window.ResizeObserver(update);
        [...tabs, ...labels].forEach(element => observer.observe(element));
        update();
        return () => observer.disconnect();
    }, []);

    const items = [
        {
            id: 'play',
            label: messages.navPlay,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                </svg>
            ),
        },
        {
            id: 'watch',
            label: messages.navWatch,
            badge: isWatchActive,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ),
        },
        {
            id: 'settings',
            label: messages.navSettings,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ),
        },
    ];

    const handleKeyDown = (e, idx) => {
        let nextIdx = null;
        if (e.key === 'ArrowRight') {
            nextIdx = (idx + 1) % items.length;
        } else if (e.key === 'ArrowLeft') {
            nextIdx = (idx - 1 + items.length) % items.length;
        } else if (e.key === 'Home') {
            nextIdx = 0;
        } else if (e.key === 'End') {
            nextIdx = items.length - 1;
        }
        if (nextIdx !== null) {
            e.preventDefault();
            onSelectTab(items[nextIdx].id);
            tabRefs.current[nextIdx]?.focus();
        }
    };

    return (
        <nav className="bottom-nav" aria-label={messages.primaryNavLabel || 'Primary Navigation'}>
            <div ref={tabList} className={`bottom-nav__list${compact ? ' bottom-nav__list--compact' : ''}`} role="tablist">
                {items.map((item, idx) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            ref={(el) => {
                                tabRefs.current[idx] = el;
                            }}
                            id={`nav-${item.id}`}
                            type="button"
                            role="tab"
                            aria-label={item.label}
                            aria-selected={isActive}
                            tabIndex={isActive || (activeTab == null && idx === 0) ? 0 : -1}
                            className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
                            onClick={() => onSelectTab(item.id)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                        >
                            <span className="bottom-nav__icon-wrap">
                                {item.icon}
                                {item.badge && <span className="bottom-nav__dot" aria-hidden="true" />}
                            </span>
                            <span className="bottom-nav__label" aria-hidden="true">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
