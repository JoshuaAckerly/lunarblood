import Main from '@/layouts/main';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React, { useState } from 'react';

interface Venue {
    id: number;
    name: string;
    city: string;
    state: string;
    country: string;
    description: string | null;
}

interface Show {
    id: number;
    date: string | null;
    venue: string | null;
    city: string | null;
    state: string | null;
    status: string;
    ticket_url: string | null;
    price: string | null;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string;
    category: string;
}

interface SearchResults {
    venues: Venue[];
    shows: Show[];
    products: Product[];
}

interface SearchPageProps {
    query: string;
    results: SearchResults;
}

const totalCount = (results: SearchResults) => results.venues.length + results.shows.length + results.products.length;

const SearchPage: React.FC<SearchPageProps> = ({ query, results }) => {
    const [input, setInput] = useState(query);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = input.trim();
        if (q) router.get('/search', { q }, { preserveState: false });
    };

    return (
        <Main>
            <section className="mx-auto max-w-3xl">
                <h1 className="page-title">Search</h1>

                <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]" />
                        <input
                            type="search"
                            className="input w-full pl-9"
                            placeholder="Search shows, venues, merch…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Search
                    </button>
                </form>

                {query && (
                    <p className="mb-6 text-sm text-[var(--muted-foreground)]">
                        {totalCount(results) === 0
                            ? `No results for "${query}"`
                            : `${totalCount(results)} result${totalCount(results) === 1 ? '' : 's'} for "${query}"`}
                    </p>
                )}

                {results.shows.length > 0 && (
                    <div className="mb-8">
                        <h2 className="mb-3 text-lg font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">Tour Dates</h2>
                        <ul className="space-y-3">
                            {results.shows.map((show) => (
                                <li key={show.id} className="card flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">{show.venue}</p>
                                        <p className="text-sm text-[var(--muted-foreground)]">
                                            {show.city}
                                            {show.state ? `, ${show.state}` : ''} · {show.date}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3">
                                        <span className={`badge badge-${show.status}`}>{show.status}</span>
                                        {show.ticket_url && (
                                            <a href={show.ticket_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm">
                                                Tickets{show.price ? ` · $${show.price}` : ''}
                                            </a>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {results.venues.length > 0 && (
                    <div className="mb-8">
                        <h2 className="mb-3 text-lg font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">Venues</h2>
                        <ul className="space-y-3">
                            {results.venues.map((venue) => (
                                <li key={venue.id}>
                                    <a href={`/venues/${venue.id}`} className="card block transition-opacity hover:opacity-80">
                                        <p className="font-semibold">{venue.name}</p>
                                        <p className="text-sm text-[var(--muted-foreground)]">
                                            {venue.city}
                                            {venue.state ? `, ${venue.state}` : ''}
                                            {venue.country ? ` · ${venue.country}` : ''}
                                        </p>
                                        {venue.description && (
                                            <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{venue.description}</p>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {results.products.length > 0 && (
                    <div className="mb-8">
                        <h2 className="mb-3 text-lg font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">Merch</h2>
                        <ul className="space-y-3">
                            {results.products.map((product) => (
                                <li key={product.id}>
                                    <a href={`/shop/${product.id}`} className="card block transition-opacity hover:opacity-80">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">{product.name}</p>
                                            <p className="text-sm font-semibold">${product.price}</p>
                                        </div>
                                        <p className="text-sm text-[var(--muted-foreground)]">{product.category}</p>
                                        {product.description && (
                                            <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{product.description}</p>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {!query && <p className="text-center text-[var(--muted-foreground)]">Enter a search term above to find shows, venues, and merch.</p>}
            </section>
        </Main>
    );
};

export default SearchPage;
