import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useToast } from "@/components/Toast";

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
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-grow py-8">
                <div className="container">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Main;
