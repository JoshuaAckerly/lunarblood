import React from 'react';

const Footer: React.FC = () => (
    <footer className="py-8">
        <div className="container text-center text-[var(--muted-foreground)]">
            <p className="text-sm">&copy; {new Date().getFullYear()} LunarBlood. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;