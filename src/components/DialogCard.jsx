import React, { useEffect, useRef } from 'react';

export function DialogCard({ id, title, closeLabel, onClose, panel = false, returnFocusRef, children }) {
    const cardRef = useRef(null);
    const closeBtnRef = useRef(null);
    const titleId = `${id}-title`;

    useEffect(() => {
        const target = returnFocusRef?.current;
        const opener = target?.isConnected ? target : document.activeElement;
        closeBtnRef.current?.focus();

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
                return;
            }
            if (panel || event.key !== 'Tab') return;

            const focusables = cardRef.current?.querySelectorAll(
                'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
            );
            if (!focusables?.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const boundary = event.shiftKey ? first : last;
            if (document.activeElement === boundary || !cardRef.current.contains(document.activeElement)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            if (opener?.isConnected) opener.focus();
        };
    }, [onClose, panel, returnFocusRef]);

    const content = (
        <section
            ref={cardRef}
            id={id}
            className={`dialog-card${panel ? ' dialog-card--panel' : ''}`}
            role="dialog"
            aria-modal={panel ? undefined : true}
            aria-labelledby={titleId}
        >
            <div className="dialog-card__header">
                <h2 id={titleId} className="dialog-card__title">{title}</h2>
                <button ref={closeBtnRef} type="button" className="dialog-card__close" onClick={onClose}>
                    {closeLabel}
                </button>
            </div>
            {children}
        </section>
    );
    if (panel) return content;
    return (
        <div className="dialog-backdrop" role="presentation" onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
        }}>
            {content}
        </div>
    );
}
