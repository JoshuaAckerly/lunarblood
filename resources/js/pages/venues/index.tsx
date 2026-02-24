import React, { useState } from "react";
import Main from "@/layouts/main";
import Seo from "@/components/Seo";
import { MapPin, Calendar, ExternalLink, Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "@inertiajs/react";

// Use CDN in production, local images in development
const cdn = import.meta.env.VITE_ASSET_URL || '';
const getImageUrl = (path: string) => cdn ? `${cdn}${path}` : path;

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
    shows_count?: number;
}

interface VenuesProps {
    venues: Venue[];
}

const Venues: React.FC<VenuesProps> = ({ venues }) => {
    const [loadingVenueId, setLoadingVenueId] = useState<number | null>(null);

    return (
    <Main>
        <Seo
            title="Venues - Live Performance Locations"
            description="Explore the intimate venues where Lunar Blood performs. Find information about upcoming shows, venue capacity, and locations across the US."
            keywords="Lunar Blood venues, concert venues, metal venues, live music locations, venue booking"
            ogType="website"
            canonical="https://lunarblood.graveyardjokes.com/venues"
        />
        <section className="page-header">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="page-title">Venues</h1>
                    <p className="page-subtitle">
                        Discover the intimate spaces where we bring our dark soundscapes to life
                    </p>
                </div>
                <Link href="/venues/create" className="btn btn-primary">
                    <Plus size={16} className="mr-2" />
                    Add Venue
                </Link>
            </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
                <div key={venue.id} className="card group hover:shadow-xl transition-shadow">
                    <div className="aspect-video bg-[var(--muted)] rounded-lg mb-4 overflow-hidden">
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

                    <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <MapPin size={16} />
                            <span>{venue.city}, {venue.state} {venue.country}</span>
                        </div>
                        {venue.capacity && (
                            <div className="text-sm text-[var(--muted-foreground)]">
                                Capacity: {venue.capacity}
                            </div>
                        )}
                        {venue.shows_count !== undefined && (
                            <div className="text-sm text-[var(--muted-foreground)]">
                                Shows: {venue.shows_count}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                            <Link
                                href={`/venues/${venue.id}`}
                                className="btn btn-secondary text-sm"
                            >
                                View
                            </Link>
                            <Link
                                href={`/venues/${venue.id}/edit`}
                                className="btn btn-secondary text-sm"
                            >
                                <Edit size={14} />
                            </Link>
                        </div>
                        {venue.website && (
                            <a
                                href={venue.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary text-sm"
                            >
                                <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </section>

        {venues.length === 0 && (
            <section className="text-center py-12">
                <p className="text-[var(--muted-foreground)] mb-4">No venues found.</p>
                <Link href="/venues/create" className="btn btn-primary">
                    <Plus size={16} className="mr-2" />
                    Add Your First Venue
                </Link>
            </section>
        )}

        <section className="mt-12 card">
            <h2 className="section-title !mb-4">Venue Booking</h2>
            <p className="text-[var(--muted-foreground)] mb-4">
                Interested in booking Lunar Blood for your venue? We're always looking for new spaces to share our music.
            </p>
            <a href="mailto:booking@lunarblood.com" className="btn btn-primary">
                Contact for Booking
            </a>
        </section>
    </Main>
);
};

export default Venues;