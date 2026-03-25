import Seo from '@/components/Seo';
import StatusBadge from '@/components/StatusBadge';
import Main from '@/layouts/main';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, DollarSign, Edit, ExternalLink, MapPin } from 'lucide-react';
import React from 'react';

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

interface ShowShowProps {
    show: Show;
}

const ShowShow: React.FC<ShowShowProps> = ({ show }) => {
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

    const isUpcoming = new Date(`${show.date}T${show.time}`) > new Date();

    return (
        <Main>
            <Seo title={`${show.venue.name} - Lunar Blood Show`} description={`Lunar Blood show at ${show.venue.name} on ${formatDate(show.date)}`} />

            <div className="mx-auto max-w-4xl">
                <div className="mb-6">
                    <Link
                        href="/shows"
                        className="inline-flex items-center gap-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                    >
                        <ArrowLeft size={16} />
                        Back to Shows
                    </Link>
                </div>

                <div className="card">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{show.venue.name}</h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusBadge status={show.status} />
                                {isUpcoming && (
                                    <span className="text-sm text-[var(--muted-foreground)]">
                                        {Math.ceil((new Date(`${show.date}T${show.time}`).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{' '}
                                        days away
                                    </span>
                                )}
                            </div>
                        </div>

                        <Link href={`/shows/${show.id}/edit`} className="btn btn-secondary self-start">
                            <Edit size={16} className="mr-2" />
                            Edit Show
                        </Link>
                    </div>

                    <div className="mb-8 grid gap-6 sm:gap-8 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin size={20} className="text-[var(--muted-foreground)]" />
                                <div>
                                    <div className="font-medium">{show.venue.name}</div>
                                    <div className="text-[var(--muted-foreground)]">
                                        {show.venue.city}, {show.venue.state} {show.venue.country}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar size={20} className="text-[var(--muted-foreground)]" />
                                <span className="font-medium">{formatDate(show.date)}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-[var(--muted-foreground)]" />
                                <span className="font-medium">{formatTime(show.time)}</span>
                            </div>

                            {show.price && (
                                <div className="flex items-center gap-3">
                                    <DollarSign size={20} className="text-[var(--muted-foreground)]" />
                                    <span className="text-lg font-medium">${show.price}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {show.description && (
                                <div>
                                    <h3 className="mb-2 font-medium">Description</h3>
                                    <p className="leading-relaxed text-[var(--muted-foreground)]">{show.description}</p>
                                </div>
                            )}

                            {show.ticket_url && (
                                <div>
                                    <h3 className="mb-2 font-medium">Tickets</h3>
                                    <a
                                        href={show.ticket_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
                                    >
                                        Get Tickets
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-[var(--border)] pt-6">
                        <div className="flex flex-col gap-1 text-sm text-[var(--muted-foreground)] sm:flex-row sm:gap-4">
                            <span>Created: {new Date(show.created_at).toLocaleDateString()}</span>
                            <span>Last updated: {new Date(show.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default ShowShow;
