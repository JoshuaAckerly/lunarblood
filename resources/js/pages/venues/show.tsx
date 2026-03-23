import React from "react";
import { Link } from "@inertiajs/react";
import Main from "@/layouts/main";
import Seo from "@/components/Seo";
import { ArrowLeft, MapPin, ExternalLink, Edit } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

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

    const upcomingShows = venue.shows.filter(
        (show) => new Date(`${show.date}T${show.time}`) > new Date()
    );

    return (
        <Main>
            <Seo
                title={`${venue.name} - Lunar Blood Venue`}
                description={`${venue.name} in ${venue.city}${venue.state ? `, ${venue.state}` : ''}, ${venue.country}. ${venue.description || ''}`}
            />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/venues"
                        className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Venues
                    </Link>
                </div>

                <div className="card mb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{venue.name}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-[var(--muted-foreground)]">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin size={14} />
                                    {venue.city}{venue.state ? `, ${venue.state}` : ''}, {venue.country}
                                </span>
                                {venue.capacity && (
                                    <span>Capacity: {venue.capacity.toLocaleString()}</span>
                                )}
                            </div>
                        </div>
                        <Link
                            href={`/venues/${venue.id}/edit`}
                            className="btn btn-secondary inline-flex items-center gap-2 shrink-0"
                        >
                            <Edit size={14} />
                            Edit Venue
                        </Link>
                    </div>

                    {venue.image && (
                        <div className="aspect-video bg-[var(--muted)] rounded-lg mb-6 overflow-hidden">
                            <img
                                src={venue.image}
                                alt={venue.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="font-semibold mb-3">Details</h2>
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
                                <h2 className="font-semibold mb-3">Links</h2>
                                <a
                                    href={venue.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline text-sm"
                                >
                                    <ExternalLink size={14} />
                                    Visit Website
                                </a>
                            </div>
                        )}
                    </div>

                    {venue.description && (
                        <div className="mt-6 pt-6 border-t border-[var(--border)]">
                            <h2 className="font-semibold mb-3">About</h2>
                            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{venue.description}</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
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
                        <p className="text-[var(--muted-foreground)] text-sm">No shows scheduled at this venue yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {venue.shows.map((show) => (
                                <div key={show.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)] gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-sm">{formatDate(show.date)}</span>
                                            <span className="text-[var(--muted-foreground)] text-sm">{formatTime(show.time)}</span>
                                            <StatusBadge status={show.status} />
                                        </div>
                                        {show.description && (
                                            <p className="text-xs text-[var(--muted-foreground)] mt-1 truncate">{show.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {show.price && (
                                            <span className="text-sm">${show.price}</span>
                                        )}
                                        <Link
                                            href={`/shows/${show.id}`}
                                            className="btn btn-secondary text-xs px-2 py-1"
                                        >
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
