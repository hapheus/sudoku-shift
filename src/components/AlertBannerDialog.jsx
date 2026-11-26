import React from 'react';

export function AlertBannerDialog({
    id,
    titleId,
    title,
    message,
    cancelId,
    confirmId,
    cancelLabel,
    confirmLabel,
    confirmVariant = 'confirm',
    cancelRef = null,
    onCancel,
    onConfirm,
}) {
    return (
        <section
            id={id}
            className="confirm-banner"
            role="alertdialog"
            aria-modal="false"
            aria-labelledby={titleId}
        >
            <div className="confirm-banner__copy">
                <h2 id={titleId} className="confirm-banner__title">{title}</h2>
                <p className="confirm-banner__message">{message}</p>
            </div>
            <div className="confirm-banner__actions">
                <button
                    ref={cancelRef}
                    type="button"
                    id={cancelId}
                    className="button button-outline confirm-banner__btn confirm-banner__btn--cancel"
                    onClick={onCancel}
                >
                    {cancelLabel}
                </button>
                <button
                    type="button"
                    id={confirmId}
                    className={`button button-fill confirm-banner__btn confirm-banner__btn--${confirmVariant}`}
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </button>
            </div>
        </section>
    );
}
