import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { useToast } from '@/components/Toast';
import { useGoogleAnalytics } from '@/hooks/use-google-analytics';
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
    useGoogleAnalytics();

    useEffect(() => {
        if (flash?.success) addToast(flash.success, 'success');
        if (flash?.error) addToast(flash.error, 'error');
        if (flash?.info) addToast(flash.info, 'info');
    }, [flash?.success, flash?.error, flash?.info]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--background)] focus:px-4 focus:py-2 focus:text-sm focus:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
                Skip to main content
            </a>
            <Header />
            <main id="main-content" className="flex-grow py-8">
                <div className="container">
                    <ErrorBoundary>{children}</ErrorBoundary>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Main;
