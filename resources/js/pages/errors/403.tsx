import Main from '@/layouts/main';
import { Home, Lock } from 'lucide-react';
import React from 'react';

const Forbidden: React.FC = () => (
    <Main>
        <section className="py-16 text-center">
            <div className="mb-8">
                <Lock size={64} className="mx-auto mb-4 text-[var(--muted-foreground)]" />
                <h1 className="mb-4 text-6xl font-bold text-[var(--muted-foreground)]">403</h1>
                <h2 className="mb-4 text-3xl font-bold">Access Forbidden</h2>
                <p className="mx-auto max-w-md text-[var(--muted-foreground)]">
                    You don't have permission to access this resource. This area is restricted to authorized users only.
                </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a href="/" className="btn btn-primary flex items-center gap-2">
                    <Home size={16} />
                    Go Home
                </a>
            </div>
        </section>
    </Main>
);

export default Forbidden;
