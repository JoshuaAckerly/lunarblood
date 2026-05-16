import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React, { useRef, useState } from 'react';

const SearchBar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const openBar = () => {
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return;
        setOpen(false);
        setValue('');
        router.get('/search', { q }, { preserveState: false });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setOpen(false);
            setValue('');
        }
    };

    if (!open) {
        return (
            <button
                onClick={openBar}
                aria-label="Open search"
                className="nav-link flex items-center gap-1 text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary-foreground)]"
            >
                <Search size={16} />
            </button>
        );
    }

    return (
        <form onSubmit={submit} className="flex items-center gap-1">
            <input
                ref={inputRef}
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => { if (!value) setOpen(false); }}
                placeholder="Search…"
                className="input w-40 py-1 text-sm"
                aria-label="Search"
            />
            <button type="submit" className="btn btn-primary py-1 text-sm">Go</button>
        </form>
    );
};

export default SearchBar;
