import React from 'react';

const Header: React.FC = () => (
    <header className="py-4">
        <div className="container flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="text-2xl font-semibold text-[var(--primary-foreground)]">LunarBlood</div>
                <span className="text-sm text-[var(--muted-foreground)]">Dark • Mood • Heavy</span>
            </div>

            <nav className="flex items-center gap-4">
                <a className="nav-link" href="#listen">Listen</a>
                <a className="nav-link" href="#tour">Tour</a>
                <a className="nav-link" href="#shop">Shop</a>
                <a className="btn btn-primary" href="#listen">Listen Now</a>
            </nav>
        </div>
    </header>
);

export default Header;