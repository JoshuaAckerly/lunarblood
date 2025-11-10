import React from "react";
import Main from "@/layouts/main";
import { Home, Lock } from "lucide-react";

const Forbidden: React.FC = () => (
    <Main>
        <section className="text-center py-16">
            <div className="mb-8">
                <Lock size={64} className="mx-auto text-[var(--muted-foreground)] mb-4" />
                <h1 className="text-6xl font-bold text-[var(--muted-foreground)] mb-4">403</h1>
                <h2 className="text-3xl font-bold mb-4">Access Forbidden</h2>
                <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
                    You don't have permission to access this resource. 
                    This area is restricted to authorized users only.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/" className="btn btn-primary flex items-center gap-2">
                    <Home size={16} />
                    Go Home
                </a>
            </div>
        </section>
    </Main>
);

export default Forbidden;