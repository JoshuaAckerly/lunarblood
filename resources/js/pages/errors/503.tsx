import React from "react";
import Main from "@/layouts/main";
import { Home } from "lucide-react";

const ServiceUnavailable: React.FC = () => (
    <Main>
        <section className="text-center py-16">
            <div className="mb-8">
                <h1 className="text-8xl font-bold text-[var(--muted-foreground)] mb-4">503</h1>
                <h2 className="text-3xl font-bold mb-4">Service Unavailable</h2>
                <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
                    We're currently performing maintenance. We'll be back shortly.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/" className="btn btn-primary flex items-center gap-2">
                    <Home size={16} />
                    Go Home
                </a>
                <button 
                    onClick={() => window.location.reload()} 
                    className="btn btn-secondary flex items-center gap-2"
                >
                    Try Again
                </button>
            </div>
        </section>
    </Main>
);

export default ServiceUnavailable;
