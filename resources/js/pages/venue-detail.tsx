import React from "react";
import Main from "@/layouts/main";
import Seo from "@/components/Seo";
import { MapPin, Calendar, Users, ExternalLink, ArrowLeft, Edit } from "lucide-react";
import { Link } from "@inertiajs/react";

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
        "@context": "https://schema.org",
        "@type": "MusicVenue",
        "name": venue.name,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": venue.address,
            "addressLocality": venue.city,
            "addressRegion": venue.state,
            "addressCountry": venue.country
        },
        "maximumAttendeeCapacity": venue.capacity,
        "description": venue.description,
        "url": venue.website,
        "telephone": venue.phone
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
            <div className="flex justify-between items-center mb-4">
                <a href="/venues" className="inline-flex items-center gap-2 nav-link">
                    <ArrowLeft size={16} />
                    Back to Venues
                </a>
                <Link
                    href={`/venues/${venue.id}/edit`}
                    className="btn btn-secondary"
                >
                    <Edit size={16} className="mr-2" />
                    Edit Venue
                </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <div className="aspect-video bg-[var(--muted)] rounded-lg mb-6 overflow-hidden">
                        {venue.image ? (
                            <img
                                src={venue.image}
                                alt={venue.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--muted)] flex items-center justify-center">
                                <span className="text-[var(--muted-foreground)]">Venue Photo</span>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h1 className="page-title !mb-4">{venue.name}</h1>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                            <MapPin size={20} />
                            <div>
                                <div className="font-medium">{venue.city}{venue.state ? `, ${venue.state}` : ''} {venue.country}</div>
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

                    {venue.description && (
                        <p className="text-[var(--muted-foreground)] mb-6">
                            {venue.description}
                        </p>
                    )}

                    <div className="flex gap-3">
                        {venue.website && (
                            <a
                                href={venue.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                <ExternalLink size={16} className="mr-2" />
                                Visit Website
                            </a>
                        )}
                        {venue.phone && (
                            <a
                                href={`tel:${venue.phone}`}
                                className="btn btn-secondary"
                            >
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
                        <div key={show.id} className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-lg">
                            <div className="flex items-center gap-3">
                                <Calendar size={20} />
                                <div>
                                    <div className="font-medium">{show.title}</div>
                                    <div className="text-sm text-[var(--muted-foreground)]">{show.date} - {show.status}</div>
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