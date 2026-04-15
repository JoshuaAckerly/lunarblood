import { ToastProvider, useToast } from '@/components/Toast';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// Helper component to trigger toasts via the context hook
const ToastTrigger: React.FC<{ message: string; variant?: 'success' | 'error' | 'info' }> = ({ message, variant = 'info' }) => {
    const { addToast } = useToast();
    return (
        <button type="button" onClick={() => addToast(message, variant)}>
            Show Toast
        </button>
    );
};

const renderWithProvider = (message: string, variant?: 'success' | 'error' | 'info') => {
    return render(
        <ToastProvider>
            <ToastTrigger message={message} variant={variant} />
        </ToastProvider>,
    );
};

describe('ToastProvider', () => {
    it('renders children without showing any toasts initially', () => {
        render(
            <ToastProvider>
                <span>content</span>
            </ToastProvider>,
        );
        expect(screen.getByText('content')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('shows a toast when addToast is called', async () => {
        const user = userEvent.setup({ delay: null });
        renderWithProvider('Hello world', 'info');
        await user.click(screen.getByRole('button', { name: 'Show Toast' }));
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('renders success variant toast', async () => {
        const user = userEvent.setup({ delay: null });
        renderWithProvider('Saved successfully', 'success');
        await user.click(screen.getByRole('button', { name: 'Show Toast' }));
        expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    });

    it('renders error variant toast', async () => {
        const user = userEvent.setup({ delay: null });
        renderWithProvider('Something went wrong', 'error');
        await user.click(screen.getByRole('button', { name: 'Show Toast' }));
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('dismisses toast when dismiss button is clicked', async () => {
        const user = userEvent.setup({ delay: null });
        renderWithProvider('Dismiss me', 'info');
        await user.click(screen.getByRole('button', { name: 'Show Toast' }));
        expect(screen.getByText('Dismiss me')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
        expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
    });

    it('throws when useToast is used outside ToastProvider', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const BadComponent = () => {
            useToast();
            return null;
        };
        expect(() => render(<BadComponent />)).toThrow('useToast must be used inside ToastProvider');
        spy.mockRestore();
    });
});
