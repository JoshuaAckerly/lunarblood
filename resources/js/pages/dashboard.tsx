import React, { useMemo, useState } from 'react';
import Main from '@/layouts/main';
import Seo from '@/components/Seo';
import { CalendarDays, Clock3, Music2, RefreshCw, ShoppingBag, Store, TriangleAlert, Plus, MapPin } from 'lucide-react';

interface DashboardStats {
    venues: number;
    shows_total: number;
    shows_upcoming: number;
    products_active: number;
    products_low_stock: number;
}

interface DashboardShow {
    id: number;
    date: string | null;
    time: string | null;
    status: string | null;
    price: string | null;
    venue: {
        name: string | null;
        city: string | null;
        state: string | null;
    };
}

interface DashboardProduct {
    id: number;
    name: string;
    stock: number;
    category: string | null;
}

interface DashboardPayload {
    stats: DashboardStats;
    upcoming_shows: DashboardShow[];
    low_stock_products: DashboardProduct[];
    generated_at: string;
}

interface DashboardSearchShowResult {
    id: number;
    date: string | null;
    status: string | null;
    venue_name: string | null;
    venue_location: string | null;
}

interface DashboardSearchVenueResult {
    id: number;
    name: string;
    location: string | null;
}

interface DashboardSearchResults {
    shows: DashboardSearchShowResult[];
    venues: DashboardSearchVenueResult[];
}

interface DashboardProps {
    dashboard: DashboardPayload;
    initialError?: string | null;
}

const EMPTY_DASHBOARD_DATA: DashboardPayload = {
    stats: {
        venues: 0,
        shows_total: 0,
        shows_upcoming: 0,
        products_active: 0,
        products_low_stock: 0,
    },
    upcoming_shows: [],
    low_stock_products: [],
    generated_at: '',
};

const EMPTY_SEARCH_RESULTS: DashboardSearchResults = {
    shows: [],
    venues: [],
};

const SEARCH_HINTS = ['show', 'gig', 'concert', 'venue', 'city'];

const toFiniteNumber = (value: unknown): number => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === 'string') {
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
};

const toNullableString = (value: unknown): string | null => {
    return typeof value === 'string' && value.trim().length > 0 ? value : null;
};

const toStringWithFallback = (value: unknown, fallback: string): string => {
    if (typeof value === 'string' && value.trim().length > 0) {
        return value;
    }

    return fallback;
};

const normalizeDashboardPayload = (input: unknown): DashboardPayload => {
    const source = typeof input === 'object' && input !== null ? (input as Partial<DashboardPayload>) : {};
    const sourceStats = typeof source.stats === 'object' && source.stats !== null ? source.stats : EMPTY_DASHBOARD_DATA.stats;
    const upcomingShowsSource = Array.isArray(source.upcoming_shows) ? source.upcoming_shows : [];
    const lowStockProductsSource = Array.isArray(source.low_stock_products) ? source.low_stock_products : [];

    return {
        stats: {
            venues: toFiniteNumber(sourceStats.venues),
            shows_total: toFiniteNumber(sourceStats.shows_total),
            shows_upcoming: toFiniteNumber(sourceStats.shows_upcoming),
            products_active: toFiniteNumber(sourceStats.products_active),
            products_low_stock: toFiniteNumber(sourceStats.products_low_stock),
        },
        upcoming_shows: upcomingShowsSource
            .filter((show): show is DashboardShow => typeof show === 'object' && show !== null && 'id' in show)
            .map((show) => ({
                id: toFiniteNumber(show.id),
                date: toNullableString(show.date),
                time: toNullableString(show.time),
                status: toNullableString(show.status),
                price: toNullableString(show.price),
                venue: {
                    name: toNullableString(show.venue?.name),
                    city: toNullableString(show.venue?.city),
                    state: toNullableString(show.venue?.state),
                },
            }))
            .filter((show) => show.id > 0),
        low_stock_products: lowStockProductsSource
            .filter((product): product is DashboardProduct => typeof product === 'object' && product !== null && 'id' in product)
            .map((product) => ({
                id: toFiniteNumber(product.id),
                name: toStringWithFallback(product.name, 'Unnamed product'),
                stock: toFiniteNumber(product.stock),
                category: toNullableString(product.category),
            }))
            .filter((product) => product.id > 0),
        generated_at: toStringWithFallback(source.generated_at, ''),
    };
};

const normalizeSearchResults = (input: unknown): DashboardSearchResults => {
    const source = typeof input === 'object' && input !== null ? (input as Partial<DashboardSearchResults>) : {};
    const showsSource = Array.isArray(source.shows) ? source.shows : [];
    const venuesSource = Array.isArray(source.venues) ? source.venues : [];

    return {
        shows: showsSource
            .filter((show): show is DashboardSearchShowResult => typeof show === 'object' && show !== null && 'id' in show)
            .map((show) => ({
                id: toFiniteNumber(show.id),
                date: toNullableString(show.date),
                status: toNullableString(show.status),
                venue_name: toNullableString(show.venue_name),
                venue_location: toNullableString(show.venue_location),
            }))
            .filter((show) => show.id > 0),
        venues: venuesSource
            .filter((venue): venue is DashboardSearchVenueResult => typeof venue === 'object' && venue !== null && 'id' in venue)
            .map((venue) => ({
                id: toFiniteNumber(venue.id),
                name: toStringWithFallback(venue.name, 'Unnamed venue'),
                location: toNullableString(venue.location),
            }))
            .filter((venue) => venue.id > 0),
    };
};

const Dashboard: React.FC<DashboardProps> = ({ dashboard, initialError = null }) => {
    const [data, setData] = useState<DashboardPayload>(() => normalizeDashboardPayload(dashboard));
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(initialError);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<DashboardSearchResults>(EMPTY_SEARCH_RESULTS);
    const [isSearching, setIsSearching] = useState(false);
    const [searchErrorMessage, setSearchErrorMessage] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const generatedAt = useMemo(() => {
        const date = new Date(data.generated_at);

        if (Number.isNaN(date.getTime())) {
            return 'Unknown';
        }

        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    }, [data.generated_at]);

    const hasStatsData =
        data.stats.venues > 0 ||
        data.stats.shows_total > 0 ||
        data.stats.shows_upcoming > 0 ||
        data.stats.products_active > 0 ||
        data.stats.products_low_stock > 0;

    const statsStatusText = isLoading
        ? 'Refreshing data...'
        : errorMessage
          ? 'Showing last known data'
          : hasStatsData
            ? 'Live data'
            : 'No dashboard metrics yet';

    const refreshDashboard = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetch('/dashboard/data', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Refresh failed');
            }

            const payload = (await response.json()) as { dashboard?: unknown };

            if (!payload.dashboard) {
                throw new Error('Missing dashboard payload');
            }

            setData(normalizeDashboardPayload(payload.dashboard));
        } catch {
            setErrorMessage('Unable to refresh dashboard data right now. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const totalSearchResults = searchResults.shows.length + searchResults.venues.length;

    const clearSearch = () => {
        setSearchQuery('');
        setHasSearched(false);
        setSearchErrorMessage(null);
        setSearchResults(EMPTY_SEARCH_RESULTS);
    };

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedQuery = searchQuery.trim();

        if (normalizedQuery === '') {
            setHasSearched(false);
            setSearchErrorMessage(null);
            setSearchResults(EMPTY_SEARCH_RESULTS);
            return;
        }

        setIsSearching(true);
        setSearchErrorMessage(null);
        setHasSearched(true);

        try {
            const response = await fetch(`/dashboard/search?query=${encodeURIComponent(normalizedQuery)}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (response.status === 422) {
                setSearchResults(EMPTY_SEARCH_RESULTS);
                setSearchErrorMessage('Search query is too long. Please keep it under 100 characters.');
                return;
            }

            if (!response.ok) {
                throw new Error('Search request failed');
            }

            const payload = (await response.json()) as { results?: unknown };
            setSearchResults(normalizeSearchResults(payload.results));
        } catch {
            setSearchResults(EMPTY_SEARCH_RESULTS);
            setSearchErrorMessage('Unable to search right now. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Main>
            <Seo
                title="Dashboard"
                description="Authenticated dashboard for Lunarblood operational status and content inventory."
                keywords="Lunarblood dashboard, shows, venues, merch inventory"
                ogType="website"
                canonical="https://lunarblood.graveyardjokes.com/dashboard"
            />

            <section className="page-header flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Live snapshot of shows, venues, and merch inventory.</p>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">Last updated: {generatedAt}</p>
                </div>

                <button
                    type="button"
                    onClick={refreshDashboard}
                    className="btn btn-secondary"
                    disabled={isLoading}
                    aria-busy={isLoading}
                >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    {isLoading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </section>

            {errorMessage && (
                <section className="card mb-8 border border-[var(--destructive)]/30">
                    <div className="flex items-start gap-3 text-[var(--destructive)]">
                        <TriangleAlert size={18} className="mt-0.5" />
                        <div>
                            <h2 className="font-semibold">Data load issue</h2>
                            <p className="text-sm text-[var(--muted-foreground)] mt-1">{errorMessage}</p>
                        </div>
                    </div>
                </section>
            )}

            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
                <article className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--muted-foreground)]">Venues</span>
                        <Store size={16} />
                    </div>
                    <p className="text-3xl font-bold">{data.stats.venues}</p>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)]">{statsStatusText}</p>
                </article>

                <article className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--muted-foreground)]">Total Shows</span>
                        <Music2 size={16} />
                    </div>
                    <p className="text-3xl font-bold">{data.stats.shows_total}</p>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)]">{statsStatusText}</p>
                </article>

                <article className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--muted-foreground)]">Upcoming Shows</span>
                        <CalendarDays size={16} />
                    </div>
                    <p className="text-3xl font-bold">{data.stats.shows_upcoming}</p>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)]">{statsStatusText}</p>
                </article>

                <article className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--muted-foreground)]">Active Products</span>
                        <ShoppingBag size={16} />
                    </div>
                    <p className="text-3xl font-bold">{data.stats.products_active}</p>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)]">{statsStatusText}</p>
                </article>

                <article className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--muted-foreground)]">Low Stock</span>
                        <TriangleAlert size={16} className="text-[var(--destructive)]" />
                    </div>
                    <p className="text-3xl font-bold">{data.stats.products_low_stock}</p>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)]">{statsStatusText}</p>
                </article>
            </section>

            <section className="card mb-8">
                <h2 className="section-title !mb-4">Quick Actions</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <a
                        href="/shows/create"
                        className="btn btn-primary flex items-center justify-center gap-2"
                        aria-label="Create a new show"
                    >
                        <Plus size={16} />
                        Add New Show
                    </a>
                    <a
                        href="/venues"
                        className="btn btn-primary flex items-center justify-center gap-2"
                        aria-label="Manage venues"
                    >
                        <MapPin size={16} />
                        Manage Venues
                    </a>
                    <a
                        href="/shop"
                        className="btn btn-primary flex items-center justify-center gap-2"
                        aria-label="View all products"
                    >
                        <ShoppingBag size={16} />
                        View All Products
                    </a>
                    <button
                        type="button"
                        className="btn btn-primary flex items-center justify-center gap-2"
                        aria-label="View low stock alerts"
                        onClick={() => document.getElementById('low-stock-products')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <TriangleAlert size={16} />
                        Low Stock Alerts
                    </button>
                </div>
            </section>

            <section className="card mb-8">
                <h2 className="section-title !mb-4">Search (Shows + Venues)</h2>
                <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label htmlFor="dashboard-search" className="mb-2 block text-sm text-[var(--muted-foreground)]">
                            Search query
                        </label>
                        <input
                            id="dashboard-search"
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search venues, cities, show status, or descriptions"
                            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                            maxLength={100}
                        />
                        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                            Scope: shows and venues. Try terms like {SEARCH_HINTS.join(', ')}.
                        </p>
                    </div>
                    <button type="submit" className="btn btn-secondary" disabled={isSearching} aria-busy={isSearching}>
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {searchErrorMessage && (
                    <p className="mt-3 text-sm text-[var(--destructive)]">{searchErrorMessage}</p>
                )}

                {hasSearched && !isSearching && !searchErrorMessage && totalSearchResults === 0 && (
                    <div className="mt-3 rounded-md border border-dashed border-[var(--border)] p-3">
                        <p className="text-sm text-[var(--muted-foreground)]">No results found for “{searchQuery.trim()}”.</p>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">Try a venue name, city/state, show status, or a synonym like “gig” or “concert”.</p>
                        <button type="button" className="mt-3 text-sm font-medium hover:underline" onClick={clearSearch}>
                            Clear search
                        </button>
                    </div>
                )}

                {isSearching && <p className="mt-3 text-sm text-[var(--muted-foreground)]">Searching shows and venues...</p>}

                {hasSearched && totalSearchResults > 0 && !searchErrorMessage && (
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <p className="lg:col-span-2 text-sm text-[var(--muted-foreground)]">
                            Top matches shown: {searchResults.shows.length} show{searchResults.shows.length === 1 ? '' : 's'} and {searchResults.venues.length} venue{searchResults.venues.length === 1 ? '' : 's'}.
                        </p>

                        <article>
                            <h3 className="text-sm font-semibold mb-2">Shows</h3>
                            {searchResults.shows.length === 0 ? (
                                <p className="text-sm text-[var(--muted-foreground)]">No matching shows.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {searchResults.shows.map((show) => (
                                        <li key={show.id} className="rounded-md border border-[var(--border)] p-3">
                                            <a href={`/shows/${show.id}`} className="font-medium hover:underline">
                                                {show.venue_name ?? 'Show'}
                                            </a>
                                            <p className="text-sm text-[var(--muted-foreground)] mt-1">
                                                {show.venue_location ?? 'Location TBD'}
                                            </p>
                                            <p className="text-sm text-[var(--muted-foreground)] mt-1">
                                                {show.date ?? 'Date TBD'} • {show.status ?? 'Scheduled'}
                                            </p>
                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                                <a href={`/shows/${show.id}`} className="font-medium hover:underline">
                                                    Open show
                                                </a>
                                                <a href="/shows" className="text-[var(--muted-foreground)] hover:underline">
                                                    View all shows
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </article>

                        <article>
                            <h3 className="text-sm font-semibold mb-2">Venues</h3>
                            {searchResults.venues.length === 0 ? (
                                <p className="text-sm text-[var(--muted-foreground)]">No matching venues.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {searchResults.venues.map((venue) => (
                                        <li key={venue.id} className="rounded-md border border-[var(--border)] p-3">
                                            <a href={`/venues/${venue.id}`} className="font-medium hover:underline">
                                                {venue.name}
                                            </a>
                                            <p className="text-sm text-[var(--muted-foreground)] mt-1">
                                                {venue.location ?? 'Location TBD'}
                                            </p>
                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                                <a href={`/venues/${venue.id}`} className="font-medium hover:underline">
                                                    Open venue
                                                </a>
                                                <a href="/venues" className="text-[var(--muted-foreground)] hover:underline">
                                                    View all venues
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </article>
                    </div>
                )}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <article className="card">
                    <h2 className="section-title !mb-4">Upcoming Shows</h2>
                    {isLoading && data.upcoming_shows.length === 0 ? (
                        <p className="text-sm text-[var(--muted-foreground)]">Refreshing upcoming shows...</p>
                    ) : errorMessage && data.upcoming_shows.length === 0 ? (
                        <p className="text-sm text-[var(--muted-foreground)]">Unable to load upcoming shows right now.</p>
                    ) : data.upcoming_shows.length === 0 ? (
                        <p className="text-sm text-[var(--muted-foreground)]">No upcoming shows found.</p>
                    ) : (
                        <ul className="space-y-3">
                            {data.upcoming_shows.map((show) => (
                                <li key={show.id} className="rounded-md border border-[var(--border)] p-3">
                                    <p className="font-medium">{show.venue.name ?? 'Venue TBD'}</p>
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        {show.venue.city && show.venue.state
                                            ? `${show.venue.city}, ${show.venue.state}`
                                            : 'Location TBD'}
                                    </p>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                        <span className="inline-flex items-center gap-1">
                                            <CalendarDays size={14} />
                                            {show.date ?? 'Date TBD'}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock3 size={14} />
                                            {show.time ?? 'Time TBD'}
                                        </span>
                                        <span className="text-[var(--accent)]">{show.status ?? 'Scheduled'}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </article>

                <article className="card" id="low-stock-products">
                    <h2 className="section-title !mb-4">Low Stock Products</h2>
                    {isLoading && data.low_stock_products.length === 0 ? (
                        <p className="text-sm text-[var(--muted-foreground)]">Refreshing low-stock products...</p>
                    ) : errorMessage && data.low_stock_products.length === 0 ? (
                        <p className="text-sm text-[var(--muted-foreground)]">Unable to load low-stock products right now.</p>
                    ) : data.low_stock_products.length === 0 ? (
                        <p className="text-sm text-[var(--muted-foreground)]">No low-stock products right now.</p>
                    ) : (
                        <ul className="space-y-3">
                            {data.low_stock_products.map((product) => (
                                <li key={product.id} className="rounded-md border border-[var(--border)] p-3">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        {product.category ?? 'Uncategorized'}
                                    </p>
                                    <p className="mt-2 text-sm">
                                        Stock remaining: <span className="font-semibold">{product.stock}</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </article>
            </section>
        </Main>
    );
};

export default Dashboard;
