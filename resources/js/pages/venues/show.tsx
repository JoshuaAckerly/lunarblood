import Seo from '@/components/Seo';
import StatusBadge from '@/components/StatusBadge';
import Main from '@/layouts/main';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit, ExternalLink, MapPin } from 'lucide-react';
import React from 'react';

interface Show {
    id: number;
    date: string;
    time: string;
    status: 'coming-soon' | 'on-sale' | 'sold-out' | 'cancelled';
    price?: number;
    description?: string;
    ticket_url?: string;
}

interface Venue {
    id: number;
    name: string;
    city: string;
    state?: string;
    country: string;
    address: string;
    capacity?: number;
    website?: string;
    phone?: string;
    description?: string;
    image?: string;
    shows: Show[];
}

interface VenueShowProps {
    venue: Venue;
}

const VenueShow: React.FC<VenueShowProps> = ({ venue }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
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

    const upcomingShows = venue.shows.filter((show) => new Date(`${show.date}T${show.time}`) > new Date());

    return (
        <Main>
            <Seo
                title={`${venue.name} - Lunar Blood Venue`}
                description={`${venue.name} in ${venue.city}${venue.state ? `, ${venue.state}` : ''}, ${venue.country}. ${venue.description || ''}`}
            />

            <div className="mx-auto max-w-4xl">
                <div className="mb-6">
                    <Link
                        href="/venues"
                        className="inline-flex items-center gap-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                    >
                        <ArrowLeft size={16} />
                        Back to Venues
                    </Link>
                </div>

                <div className="card mb-6">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{venue.name}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-[var(--muted-foreground)]">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin size={14} />
                                    {venue.city}
                                    {venue.state ? `, ${venue.state}` : ''}, {venue.country}
                                </span>
                                {venue.capacity && <span>Capacity: {venue.capacity.toLocaleString()}</span>}
                            </div>
                        </div>
                        <Link href={`/venues/${venue.id}/edit`} className="btn btn-secondary inline-flex shrink-0 items-center gap-2">
                            <Edit size={14} />
                            Edit Venue
                        </Link>
                    </div>

                    {venue.image && (
                        <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-[var(--muted)]">
                            <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" />
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <h2 className="mb-3 font-semibold">Details</h2>
                            <dl className="space-y-2 text-sm">
                                <div>
                                    <dt className="text-[var(--muted-foreground)]">Address</dt>
                                    <dd>{venue.address}</dd>
                                </div>
                                {venue.phone && (
                                    <div>
                                        <dt className="text-[var(--muted-foreground)]">Phone</dt>
                                        <dd>{venue.phone}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {venue.website && (
                            <div>
                                <h2 className="mb-3 font-semibold">Links</h2>
                                <a
                                    href={venue.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
                                >
                                    <ExternalLink size={14} />
                                    Visit Website
                                </a>
                            </div>
                        )}
                    </div>

                    {venue.description && (
                        <div className="mt-6 border-t border-[var(--border)] pt-6">
                            <h2 className="mb-3 font-semibold">About</h2>
                            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{venue.description}</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Shows at {venue.name}
                            <span className="ml-2 text-sm font-normal text-[var(--muted-foreground)]">
                                ({venue.shows.length} total, {upcomingShows.length} upcoming)
                            </span>
                        </h2>
                        <Link href="/shows/create" className="btn btn-primary text-sm">
                            Add Show
                        </Link>
                    </div>

                    {venue.shows.length === 0 ? (
                        <p className="text-sm text-[var(--muted-foreground)]">No shows scheduled at this venue yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {venue.shows.map((show) => (
                                <div key={show.id} className="flex items-center justify-between gap-4 rounded-lg bg-[var(--muted)] p-3">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-medium">{formatDate(show.date)}</span>
                                            <span className="text-sm text-[var(--muted-foreground)]">{formatTime(show.time)}</span>
                                            <StatusBadge status={show.status} />
                                        </div>
                                        {show.description && (
                                            <p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">{show.description}</p>
                                        )}
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {show.price && <span className="text-sm">${show.price}</span>}
                                        <Link href={`/shows/${show.id}`} className="btn btn-secondary px-2 py-1 text-xs">
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default VenueShow;
