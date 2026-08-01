import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { useToast } from '@/components/Toast';
import { useGoogleAnalytics } from '@/hooks/use-google-analytics';
import { router, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';

interface FlashData {
    success?: string | null;
    error?: string | null;
    info?: string | null;
}

const Main: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { flash } = usePage().props as { flash?: FlashData };
    const { addToast } = useToast();
    const overlayRef = useRef<HTMLDivElement>(null);
    useGoogleAnalytics();

    useEffect(() => {
        const off1 = router.on('before', () => {
            if (overlayRef.current) gsap.fromTo(overlayRef.current, { opacity: 0, pointerEvents: 'none' }, { opacity: 1, pointerEvents: 'all', duration: 0.3, ease: 'power1.in' });
        });
        const off2 = router.on('finish', () => {
            if (overlayRef.current) gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.4, ease: 'power2.out', delay: 0.05 });
        });
        return () => { off1(); off2(); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (flash?.success) addToast(flash.success, 'success');
        if (flash?.error) addToast(flash.error, 'error');
        if (flash?.info) addToast(flash.info, 'info');
    }, [flash?.success, flash?.error, flash?.info]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            <div ref={overlayRef} className="pointer-events-none fixed inset-0 z-[9999] bg-[var(--background)] opacity-0" aria-hidden="true" />
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-[var(--background)] focus:px-4 focus:py-2 focus:text-sm focus:shadow-md focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
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
