import Main from '@/layouts/main';
import { ArrowLeft, Home } from 'lucide-react';
import React from 'react';

const NotFound: React.FC = () => (
    <Main>
        <section className="py-16 text-center">
            <div className="mb-8">
                <h1 className="mb-4 text-8xl font-bold text-[var(--muted-foreground)]">404</h1>
                <h2 className="mb-4 text-3xl font-bold">Page Not Found</h2>
                <p className="mx-auto max-w-md text-[var(--muted-foreground)]">
                    The page you're looking for has vanished into the darkness. Let's get you back to familiar territory.
                </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a href="/" className="btn btn-primary flex items-center gap-2">
                    <Home size={16} />
                    Go Home
                </a>
                <button onClick={() => window.history.back()} className="btn btn-secondary flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Go Back
                </button>
            </div>

            <div className="mt-12">
                <h3 className="mb-4 text-lg font-semibold">Popular Pages</h3>
                <div className="flex flex-wrap justify-center gap-2">
                    <a href="/listen" className="nav-link">
                        Listen
                    </a>
                    <a href="/tour" className="nav-link">
                        Tour
                    </a>
                    <a href="/venues" className="nav-link">
                        Venues
                    </a>
                    <a href="/shop" className="nav-link">
                        Shop
                    </a>
                </div>
            </div>
        </section>
    </Main>
);

export default NotFound;
