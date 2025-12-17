import React from "react";
import Main from "@/layouts/main";
import Seo from "@/components/Seo";
import { MapPin, Calendar, ExternalLink } from "lucide-react";

// Use CDN in production, local images in development
const cdn = import.meta.env.VITE_ASSET_URL || '';
const getImageUrl = (path: string) => cdn ? `${cdn}${path}` : path;

const venues = [
    {
        id: 1,
        name: "The Underground",
        city: "Seattle, WA",
        capacity: 500,
        image: getImageUrl('/images/venue-underground.jpg'),
        website: "https://theunderground.com",
        upcoming: "March 15, 2024"
    },
    {
        id: 2,
        name: "Dark Moon Club",
        city: "Portland, OR",
        capacity: 300,
        image: getImageUrl('/images/venue-darkmoon.jpg'),
        website: "https://darkmoonclub.com",
        upcoming: "April 2, 2024"
    },
    {
        id: 3,
        name: "Crimson Hall",
        city: "San Francisco, CA",
        capacity: 800,
        image: getImageUrl('/images/venue-crimson.jpg'),
        website: "https://crimsonhall.com",
        upcoming: "April 20, 2024"
    }
];

const Venues: React.FC = () => (
    <Main>
        <Seo
            title="Venues - Live Performance Locations"
            description="Explore the intimate venues where Lunar Blood performs. Find information about upcoming shows, venue capacity, and locations across the US."
            keywords="Lunar Blood venues, concert venues, metal venues, live music locations, venue booking"
            ogType="website"
            canonical="https://lunarblood.graveyardjokes.com/venues"
        />
        <section className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Venues</h1>
            <p className="text-[var(--muted-foreground)] mb-8">
                Discover the intimate spaces where we bring our dark soundscapes to life
            </p>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
                <div key={venue.id} className="card group hover:shadow-xl transition-shadow">
                    <div className="aspect-video bg-[var(--muted)] rounded-lg mb-4 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--muted)] flex items-center justify-center">
                            <span className="text-[var(--muted-foreground)]">Venue Photo</span>
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
                    
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <MapPin size={16} />
                            <span>{venue.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <Calendar size={16} />
                            <span>Next show: {venue.upcoming}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">
                            Capacity: {venue.capacity}
                        </span>
                        <div className="flex gap-2">
                            <a 
                                href={`/venues/${venue.id}`}
                                className="btn btn-primary text-sm"
                            >
                                Details
                            </a>
                            <a 
                                href={venue.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary text-sm"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </section>

        <section className="mt-12 card">
            <h2 className="text-2xl font-semibold mb-4">Venue Booking</h2>
            <p className="text-[var(--muted-foreground)] mb-4">
                Interested in booking Lunar Blood for your venue? We're always looking for new spaces to share our music.
            </p>
            <a href="mailto:booking@lunarblood.com" className="btn btn-primary">
                Contact for Booking
            </a>
        </section>
    </Main>
);

export default Venues;