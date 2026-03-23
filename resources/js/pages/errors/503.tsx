import Main from '@/layouts/main';
import { Home } from 'lucide-react';
import React from 'react';

const ServiceUnavailable: React.FC = () => (
    <Main>
        <section className="py-16 text-center">
            <div className="mb-8">
                <h1 className="mb-4 text-8xl font-bold text-[var(--muted-foreground)]">503</h1>
                <h2 className="mb-4 text-3xl font-bold">Service Unavailable</h2>
                <p className="mx-auto max-w-md text-[var(--muted-foreground)]">We're currently performing maintenance. We'll be back shortly.</p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a href="/" className="btn btn-primary flex items-center gap-2">
                    <Home size={16} />
                    Go Home
                </a>
                <button onClick={() => window.location.reload()} className="btn btn-secondary flex items-center gap-2">
                    Try Again
                </button>
            </div>
        </section>
    </Main>
);

export default ServiceUnavailable;
