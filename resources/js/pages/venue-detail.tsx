import Seo from '@/components/Seo';
import Main from '@/layouts/main';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, ExternalLink, MapPin, Users } from 'lucide-react';
import React from 'react';

interface Show {
    id: number;
    title: string;
    date: string;
    status: string;
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
    description?: string;
    website?: string;
    phone?: string;
    image?: string;
    shows: Show[];
}

interface VenueDetailProps {
    venue: Venue;
}

const VenueDetail: React.FC<VenueDetailProps> = ({ venue }) => {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'MusicVenue',
        name: venue.name,
        address: {
            '@type': 'PostalAddress',
            streetAddress: venue.address,
            addressLocality: venue.city,
            addressRegion: venue.state,
            addressCountry: venue.country,
        },
        maximumAttendeeCapacity: venue.capacity,
        description: venue.description,
        url: venue.website,
        telephone: venue.phone,
    };

    return (
        <Main>
            <Seo
                title={`${venue.name} - Venue`}
                description={`${venue.description || 'Music venue'} Located in ${venue.city}${venue.state ? ', ' + venue.state : ''} ${venue.capacity ? 'with capacity of ' + venue.capacity : ''}.`}
                keywords={`${venue.name}, music venue, concert venue, ${venue.city}, live music`}
                ogType="website"
                canonical={`https://lunarblood.graveyardjokes.com/venues/${venue.id}`}
                structuredData={structuredData}
            />
            <section className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <a href="/venues" className="nav-link inline-flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back to Venues
                    </a>
                    <Link href={`/venues/${venue.id}/edit`} className="btn btn-secondary">
                        <Edit size={16} className="mr-2" />
                        Edit Venue
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                        <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-[var(--muted)]">
                            {venue.image ? (
                                <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--accent)] to-[var(--muted)]">
                                    <span className="text-[var(--muted-foreground)]">Venue Photo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h1 className="page-title !mb-4">{venue.name}</h1>

                        <div className="mb-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <MapPin size={20} />
                                <div>
                                    <div className="font-medium">
                                        {venue.city}
                                        {venue.state ? `, ${venue.state}` : ''} {venue.country}
                                    </div>
                                    <div className="text-sm text-[var(--muted-foreground)]">{venue.address}</div>
                                </div>
                            </div>

                            {venue.capacity && (
                                <div className="flex items-center gap-3">
                                    <Users size={20} />
                                    <span>Capacity: {venue.capacity}</span>
                                </div>
                            )}
                        </div>

                        {venue.description && <p className="mb-6 text-[var(--muted-foreground)]">{venue.description}</p>}

                        <div className="flex gap-3">
                            {venue.website && (
                                <a href={venue.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    <ExternalLink size={16} className="mr-2" />
                                    Visit Website
                                </a>
                            )}
                            {venue.phone && (
                                <a href={`tel:${venue.phone}`} className="btn btn-secondary">
                                    Call Venue
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="card">
                <h2 className="section-title">Shows at this Venue</h2>
                {venue.shows.length > 0 ? (
                    <div className="space-y-4">
                        {venue.shows.map((show) => (
                            <div key={show.id} className="flex items-center justify-between rounded-lg bg-[var(--muted)] p-4">
                                <div className="flex items-center gap-3">
                                    <Calendar size={20} />
                                    <div>
                                        <div className="font-medium">{show.title}</div>
                                        <div className="text-sm text-[var(--muted-foreground)]">
                                            {show.date} - {show.status}
                                        </div>
                                    </div>
                                </div>
                                {show.ticket_url && (
                                    <a href={show.ticket_url} className="btn btn-primary">
                                        Buy Tickets
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[var(--muted-foreground)]">No upcoming shows scheduled at this venue.</p>
                )}
            </section>
        </Main>
    );
};

export default VenueDetail;
