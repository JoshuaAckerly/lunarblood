import '../css/app.css';

import * as Sentry from '@sentry/react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from './components/Toast';
import { initializeTheme } from './hooks/use-appearance';
import { initializeGoogleAnalytics } from './hooks/use-google-analytics';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

if (sentryDsn) {
    Sentry.init({
        dsn: sentryDsn,
        environment: import.meta.env.MODE,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 0.05,
    });
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob<any>('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ToastProvider>
                <App {...props} />
            </ToastProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Initialize Google Analytics if a measurement ID is configured
if (gaMeasurementId) {
    initializeGoogleAnalytics(gaMeasurementId);
}
