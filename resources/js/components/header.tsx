import NotificationBell from '@/components/NotificationBell';
import SearchBar from '@/components/SearchBar';
import { usePage } from '@inertiajs/react';
import { useAppearance } from '@/hooks/use-appearance';
import { ChevronDown, Menu, Moon, Sun, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { appearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        if (appearance === 'dark') {
            updateAppearance('light');
        } else {
            updateAppearance('dark');
        }
    };

    const isDark = appearance === 'dark' || (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const { auth } = usePage().props as { auth?: { user?: { name: string } | null } };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="py-4">
            <div className="container flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <a href="/" className="text-2xl font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-80">
                        LunarBlood
                    </a>
                    <span className="hidden text-sm text-[var(--muted-foreground)] sm:block">Dark • Mood • Heavy</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-4 md:flex" aria-label="Main navigation">
                    <a className="nav-link" href="/">
                        Home
                    </a>
                    <a className="nav-link" href="/listen">
                        Listen
                    </a>
                    <a className="nav-link" href="/venues">
                        Venues
                    </a>
                    <a className="nav-link" href="/tour">
                        Tour
                    </a>
                    <a className="nav-link" href="/shop">
                        Shop
                    </a>
                    <a className="btn btn-primary" href="/listen">
                        Listen Now
                    </a>
                    <button
                        onClick={toggleTheme}
                        className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--primary-foreground)]"
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                    </button>
                    <SearchBar />
                    <NotificationBell />
                    {auth?.user ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                className="nav-link flex items-center gap-2"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="true"
                            >
                                <User size={16} />
                                <span>{auth.user.name}</span>
                                <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-[var(--border)] bg-[var(--background)] shadow-lg">
                                    <a
                                        href="/dashboard"
                                        className="block px-4 py-2 text-sm transition-colors hover:bg-[var(--accent)]"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        Dashboard
                                    </a>
                                    <a
                                        href="/settings/profile"
                                        className="block px-4 py-2 text-sm transition-colors hover:bg-[var(--accent)]"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        Profile Settings
                                    </a>
                                    <hr className="my-1 border-[var(--border)]" />
                                    <form method="POST" action="/logout" className="block">
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--accent)]"
                                        >
                                            Log out
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    ) : (
                        <a className="nav-link" href="/login">
                            Login
                        </a>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="p-2 md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-nav"
                >
                    {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="mt-4 border-t border-[var(--border)] pb-4 md:hidden">
                    <nav id="mobile-nav" className="container flex flex-col gap-4 pt-4" aria-label="Mobile navigation">
                        <a className="nav-link" href="/" onClick={() => setIsMenuOpen(false)}>
                            Home
                        </a>
                        <a className="nav-link" href="/listen" onClick={() => setIsMenuOpen(false)}>
                            Listen
                        </a>
                        <a className="nav-link" href="/venues" onClick={() => setIsMenuOpen(false)}>
                            Venues
                        </a>
                        {auth?.user ? (
                            <>
                                <a className="nav-link" href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                    Dashboard
                                </a>
                                <a className="nav-link" href="/settings/profile" onClick={() => setIsMenuOpen(false)}>
                                    Profile Settings
                                </a>
                                <form method="POST" action="/logout" className="inline">
                                    <button type="submit" className="nav-link w-full text-left" onClick={() => setIsMenuOpen(false)}>
                                        Log out
                                    </button>
                                </form>
                            </>
                        ) : (
                            <a className="nav-link" href="/login" onClick={() => setIsMenuOpen(false)}>
                                Login
                            </a>
                        )}
                        <a className="nav-link" href="/tour" onClick={() => setIsMenuOpen(false)}>
                            Tour
                        </a>
                        <a className="nav-link" href="/shop" onClick={() => setIsMenuOpen(false)}>
                            Shop
                        </a>
                        <a className="btn btn-primary w-full justify-center" href="/listen" onClick={() => setIsMenuOpen(false)}>
                            Listen Now
                        </a>
                        <a className="nav-link" href="/search" onClick={() => setIsMenuOpen(false)}>
                            Search
                        </a>
                        <button
                            onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                            className="nav-link flex items-center gap-2 text-left"
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
                            {isDark ? 'Light mode' : 'Dark mode'}
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
