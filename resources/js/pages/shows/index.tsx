import Seo from '@/components/Seo';
import { ShowCardSkeleton } from '@/components/Skeleton';
import StatusBadge from '@/components/StatusBadge';
import Main from '@/layouts/main';
import { Link, router } from '@inertiajs/react';
import { Calendar, Clock, DollarSign, Edit, Eye, MapPin, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Show {
    id: number;
    venue: {
        name: string;
        city: string;
        state?: string;
        country: string;
    };
    date: string;
    time: string;
    status: 'coming-soon' | 'on-sale' | 'sold-out' | 'cancelled';
    price?: number;
    description?: string;
    ticket_url?: string;
    created_at: string;
    updated_at: string;
}

interface ShowsIndexProps {
    shows: Show[];
}

const ShowsIndex: React.FC<ShowsIndexProps> = ({ shows }) => {
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', () => setIsNavigating(true));
        const removeFinish = router.on('finish', () => setIsNavigating(false));
        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <Main>
            <Seo title="Shows Management" description="Manage Lunar Blood shows and events." />

            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Shows Management</h1>
                    <Link href="/shows/create" className="btn btn-primary">
                        <Plus size={16} className="mr-2" />
                        Create New Show
                    </Link>
                </div>

                {isNavigating ? (
                    <div className="grid gap-6" aria-label="Loading shows" aria-busy="true">
                        <ShowCardSkeleton />
                        <ShowCardSkeleton />
                        <ShowCardSkeleton />
                    </div>
                ) : shows.length === 0 ? (
                    <div className="card py-12 text-center">
                        <Calendar size={48} className="mx-auto mb-4 text-[var(--muted-foreground)]" />
                        <h3 className="mb-2 text-lg font-medium">No shows yet</h3>
                        <p className="mb-6 text-[var(--muted-foreground)]">Get started by creating your first show event.</p>
                        <Link href="/shows/create" className="btn btn-primary">
                            <Plus size={16} className="mr-2" />
                            Create Your First Show
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {shows.map((show) => (
                            <div key={show.id} className="card">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-3 flex flex-wrap items-center gap-3">
                                            <h3 className="text-lg font-semibold">{show.venue.name}</h3>
                                            <StatusBadge status={show.status} size="sm" />
                                        </div>

                                        <div className="mb-4 grid gap-4 md:grid-cols-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin size={16} className="text-[var(--muted-foreground)]" />
                                                <span>
                                                    {show.venue.city}, {show.venue.state} {show.venue.country}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar size={16} className="text-[var(--muted-foreground)]" />
                                                <span>{formatDate(show.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock size={16} className="text-[var(--muted-foreground)]" />
                                                <span>{formatTime(show.time)}</span>
                                            </div>
                                        </div>

                                        {show.price && (
                                            <div className="mb-3 flex items-center gap-2 text-sm">
                                                <DollarSign size={16} className="text-[var(--muted-foreground)]" />
                                                <span className="font-medium">${show.price}</span>
                                            </div>
                                        )}

                                        {show.description && (
                                            <p className="mb-4 line-clamp-2 text-sm text-[var(--muted-foreground)]">{show.description}</p>
                                        )}

                                        {show.ticket_url && (
                                            <a
                                                href={show.ticket_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-[var(--primary)] hover:underline"
                                            >
                                                View Tickets →
                                            </a>
                                        )}
                                    </div>

                                    <div className="ml-4 flex items-center gap-2">
                                        <Link href={`/shows/${show.id}`} className="btn btn-secondary btn-sm">
                                            <Eye size={14} />
                                        </Link>
                                        <Link href={`/shows/${show.id}/edit`} className="btn btn-secondary btn-sm">
                                            <Edit size={14} />
                                        </Link>
                                        <button
                                            className="btn btn-secondary btn-sm text-red-600 hover:text-red-700"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this show?')) {
                                                    // Handle delete
                                                }
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Main>
    );
};

export default ShowsIndex;
