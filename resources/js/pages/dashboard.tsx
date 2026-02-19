import React, { useMemo, useState } from 'react';
import Main from '@/layouts/main';
import Seo from '@/components/Seo';
import { CalendarDays, Clock3, Music2, RefreshCw, ShoppingBag, Store, TriangleAlert } from 'lucide-react';

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

interface DashboardProps {
    dashboard: DashboardPayload;
    initialError?: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ dashboard, initialError = null }) => {
    const [data, setData] = useState<DashboardPayload>(dashboard);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(initialError);

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

            const payload = (await response.json()) as { dashboard?: DashboardPayload };

            if (!payload.dashboard) {
                throw new Error('Missing dashboard payload');
            }

            setData(payload.dashboard);
        } catch {
            setErrorMessage('Unable to refresh dashboard data right now. Please try again.');
        } finally {
            setIsLoading(false);
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
                </article>

                <article className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--muted-foreground)]">Total Shows</span>
                        <Music2 size={16} />
                    </div>
                    <p className="text-3xl font-bold">{data.stats.shows_total}</p>
                </article>

                <article className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--muted-foreground)]">Upcoming Shows</span>
                        <CalendarDays size={16} />
                    </div>
                    <p className="text-3xl font-bold">{data.stats.shows_upcoming}</p>
                </article>

                <article className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--muted-foreground)]">Active Products</span>
                        <ShoppingBag size={16} />
                    </div>
                    <p className="text-3xl font-bold">{data.stats.products_active}</p>
                </article>

                <article className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--muted-foreground)]">Low Stock</span>
                        <TriangleAlert size={16} className="text-[var(--destructive)]" />
                    </div>
                    <p className="text-3xl font-bold">{data.stats.products_low_stock}</p>
                </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <article className="card">
                    <h2 className="section-title !mb-4">Upcoming Shows</h2>
                    {data.upcoming_shows.length === 0 ? (
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

                <article className="card">
                    <h2 className="section-title !mb-4">Low Stock Products</h2>
                    {data.low_stock_products.length === 0 ? (
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
