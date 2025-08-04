import React from "react";
import Main from "@/layouts/main";
import { Home, RefreshCw } from "lucide-react";

const ServerError: React.FC = () => (
    <Main>
        <section className="text-center py-16">
            <div className="mb-8">
                <h1 className="text-8xl font-bold text-[var(--muted-foreground)] mb-4">500</h1>
                <h2 className="text-3xl font-bold mb-4">Server Error</h2>
                <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
                    Something went wrong on our end. Our team has been notified 
                    and is working to fix the issue.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={() => window.location.reload()} 
                    className="btn btn-primary flex items-center gap-2"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
                <a href="/" className="btn btn-secondary flex items-center gap-2">
                    <Home size={16} />
                    Go Home
                </a>
            </div>

            <div className="mt-12 card max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    If this problem persists, please contact our support team.
                </p>
                <a href="mailto:support@lunarblood.com" className="btn btn-secondary text-sm">
                    Contact Support
                </a>
            </div>
        </section>
    </Main>
);

export default ServerError;