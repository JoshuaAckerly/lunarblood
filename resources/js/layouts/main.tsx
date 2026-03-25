import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { useToast } from '@/components/Toast';
import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface FlashData {
    success?: string | null;
    error?: string | null;
    info?: string | null;
}

const Main: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { flash } = usePage().props as { flash?: FlashData };
    const { addToast } = useToast();

    useEffect(() => {
        if (flash?.success) addToast(flash.success, 'success');
        if (flash?.error) addToast(flash.error, 'error');
        if (flash?.info) addToast(flash.info, 'info');
    }, [flash?.success, flash?.error, flash?.info]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            <Header />
            <main className="flex-grow py-8">
                <div className="container">
                    <ErrorBoundary>{children}</ErrorBoundary>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Main;
