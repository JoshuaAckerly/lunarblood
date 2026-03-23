import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    addToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
};

const AUTO_DISMISS_MS = 4500;

const VARIANT_STYLES: Record<ToastVariant, { container: string; icon: React.ReactNode }> = {
    success: {
        container: 'border-green-500/40 bg-[var(--background)] text-[var(--foreground)]',
        icon: <CheckCircle size={16} className="shrink-0 text-green-500 mt-0.5" />,
    },
    error: {
        container: 'border-[var(--destructive)]/40 bg-[var(--background)] text-[var(--foreground)]',
        icon: <XCircle size={16} className="shrink-0 text-[var(--destructive)] mt-0.5" />,
    },
    info: {
        container: 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]',
        icon: <Info size={16} className="shrink-0 text-[var(--muted-foreground)] mt-0.5" />,
    },
};

interface ToastItemProps {
    toast: Toast;
    onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        timerRef.current = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [toast.id, onDismiss]);

    const { container, icon } = VARIANT_STYLES[toast.variant];

    return (
        <div
            role="alert"
            className={`flex items-start gap-2.5 rounded-md border px-3.5 py-3 shadow-lg text-sm ${container}`}
        >
            {icon}
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                aria-label="Dismiss notification"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
        const id = Math.random().toString(36).slice(2, 9);
        setToasts((prev) => [...prev, { id, message, variant }]);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div
                role="region"
                aria-label="Notifications"
                aria-live="polite"
                className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
            >
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
