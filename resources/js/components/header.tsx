import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="py-4">
            <div className="container flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <a href="/" className="text-2xl font-semibold text-[var(--primary-foreground)] hover:opacity-80 transition-opacity">LunarBlood</a>
                    <span className="hidden sm:block text-sm text-[var(--muted-foreground)]">Dark • Mood • Heavy</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-4">
                    <a className="nav-link" href="/">Home</a>
                    <a className="nav-link" href="/listen">Listen</a>
                    <a className="nav-link" href="/venues">Venues</a>
                    <a className="nav-link" href="/tour">Tour</a>
                    <a className="nav-link" href="/shop">Shop</a>
                    <a className="btn btn-primary" href="/listen">Listen Now</a>
                    <a className="nav-link" href="http://localhost:8007/login">Login</a>
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-[var(--border)]">
                    <nav className="container flex flex-col gap-4 pt-4">
                        <a className="nav-link" href="/" onClick={() => setIsMenuOpen(false)}>Home</a>
                        <a className="nav-link" href="/listen" onClick={() => setIsMenuOpen(false)}>Listen</a>
                        <a className="nav-link" href="/venues" onClick={() => setIsMenuOpen(false)}>Venues</a>
                        <a className="nav-link" href="http://localhost:8007/login" onClick={() => setIsMenuOpen(false)}>Login</a>
                        <a className="nav-link" href="/tour" onClick={() => setIsMenuOpen(false)}>Tour</a>
                        <a className="nav-link" href="/shop" onClick={() => setIsMenuOpen(false)}>Shop</a>
                        <a className="btn btn-primary w-full justify-center" href="/listen" onClick={() => setIsMenuOpen(false)}>Listen Now</a>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;