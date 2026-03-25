import Main from '@/layouts/main';
import { Home, RefreshCw } from 'lucide-react';
import React from 'react';

const ServerError: React.FC = () => (
    <Main>
        <section className="py-16 text-center">
            <div className="mb-8">
                <h1 className="mb-4 text-8xl font-bold text-[var(--muted-foreground)]">500</h1>
                <h2 className="mb-4 text-3xl font-bold">Server Error</h2>
                <p className="mx-auto max-w-md text-[var(--muted-foreground)]">
                    Something went wrong on our end. Our team has been notified and is working to fix the issue.
                </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button onClick={() => window.location.reload()} className="btn btn-primary flex items-center gap-2">
                    <RefreshCw size={16} />
                    Try Again
                </button>
                <a href="/" className="btn btn-secondary flex items-center gap-2">
                    <Home size={16} />
                    Go Home
                </a>
            </div>

            <div className="card mx-auto mt-12 max-w-md">
                <h3 className="mb-2 text-lg font-semibold">Need Help?</h3>
                <p className="mb-4 text-sm text-[var(--muted-foreground)]">If this problem persists, please contact our support team.</p>
                <a href="mailto:support@lunarblood.com" className="btn btn-secondary text-sm">
                    Contact Support
                </a>
            </div>
        </section>
    </Main>
);

export default ServerError;
