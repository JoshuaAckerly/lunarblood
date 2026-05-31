import React, { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'default';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'default',
}) => {
    const cancelRef = useRef<HTMLButtonElement>(null);

    // Focus the cancel button when dialog opens (safer default focus)
    useEffect(() => {
        if (isOpen) {
            cancelRef.current?.focus();
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={onCancel} aria-hidden="true" />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--background)] p-6 shadow-xl">
                <h2 id="confirm-dialog-title" className="mb-2 text-lg font-semibold text-[var(--primary-foreground)]">
                    {title}
                </h2>
                <p id="confirm-dialog-message" className="mb-6 text-sm text-[var(--muted-foreground)]">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <button ref={cancelRef} onClick={onCancel} className="btn btn-secondary">
                        {cancelLabel}
                    </button>
                    <button onClick={onConfirm} className={variant === 'danger' ? 'btn btn-danger' : 'btn btn-primary'}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
