import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AlertBannerDialog } from '../src/components/AlertBannerDialog.jsx';
import { SetupView } from '../src/components/SetupView.jsx';
import { getMessages } from '../src/locales/index.js';

describe('AlertBannerDialog and SetupView', () => {
    it('renders AlertBannerDialog and triggers cancel/confirm actions', () => {
        const onCancel = vi.fn();
        const onConfirm = vi.fn();

        render(
            <AlertBannerDialog
                id="confirm-dialog"
                titleId="confirm-title"
                title="Confirm action"
                message="Proceed?"
                cancelLabel="Cancel"
                confirmLabel="Yes"
                onCancel={onCancel}
                onConfirm={onConfirm}
            />,
        );

        expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-labelledby', 'confirm-title');
        fireEvent.click(screen.getByText('Cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByText('Yes'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('renders SetupView and triggers play and resume callbacks', () => {
        const onPlay = vi.fn();
        const onResume = vi.fn();
        const messages = getMessages('en');

        render(
            <SetupView
                variant="3x3"
                difficulty="medium"
                canResumeGame
                isNativeApp={false}
                onVariantChange={vi.fn()}
                onDifficultyChange={vi.fn()}
                onPlay={onPlay}
                onResume={onResume}
                onOpenLegalPage={vi.fn()}
                messages={messages}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: messages.startPuzzle }));
        expect(onPlay).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole('button', { name: messages.resumePuzzle }));
        expect(onResume).toHaveBeenCalledTimes(1);
    });
});
