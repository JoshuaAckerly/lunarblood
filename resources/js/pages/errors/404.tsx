import React from "react";
import Main from "@/layouts/main";
import { Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => (
    <Main>
        <section className="text-center py-16">
            <div className="mb-8">
                <h1 className="text-8xl font-bold text-[var(--muted-foreground)] mb-4">404</h1>
                <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
                <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
                    The page you're looking for has vanished into the darkness. 
                    Let's get you back to familiar territory.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/" className="btn btn-primary flex items-center gap-2">
                    <Home size={16} />
                    Go Home
                </a>
                <button 
                    onClick={() => window.history.back()} 
                    className="btn btn-secondary flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Go Back
                </button>
            </div>

            <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4">Popular Pages</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                    <a href="/listen" className="nav-link">Listen</a>
                    <a href="/tour" className="nav-link">Tour</a>
                    <a href="/venues" className="nav-link">Venues</a>
                    <a href="/shop" className="nav-link">Shop</a>
                </div>
            </div>
        </section>
    </Main>
);

export default NotFound;