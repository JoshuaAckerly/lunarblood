import React from "react";
import Main from "@/layouts/main";
import { MapPin, Calendar, Users, ExternalLink, ArrowLeft } from "lucide-react";

interface VenueDetailProps {
    venue: {
        id: number;
        name: string;
        city: string;
        address: string;
        capacity: number;
        description: string;
        website: string;
        phone: string;
        shows: Array<{
            date: string;
            status: string;
            ticketUrl?: string;
        }>;
    };
}

const VenueDetail: React.FC<VenueDetailProps> = ({ venue }) => (
    <Main>
        <section className="mb-8">
            <a href="/venues" className="inline-flex items-center gap-2 nav-link mb-4">
                <ArrowLeft size={16} />
                Back to Venues
            </a>
            
            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <div className="aspect-video bg-[var(--muted)] rounded-lg mb-6 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--muted)] flex items-center justify-center">
                            <span className="text-[var(--muted-foreground)]">Venue Photo</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h1 className="text-4xl font-bold mb-4">{venue.name}</h1>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                            <MapPin size={20} />
                            <div>
                                <div className="font-medium">{venue.city}</div>
                                <div className="text-sm text-[var(--muted-foreground)]">{venue.address}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Users size={20} />
                            <span>Capacity: {venue.capacity}</span>
                        </div>
                    </div>

                    <p className="text-[var(--muted-foreground)] mb-6">
                        {venue.description}
                    </p>

                    <div className="flex gap-3">
                        <a 
                            href={venue.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            <ExternalLink size={16} />
                            Visit Website
                        </a>
                        <a 
                            href={`tel:${venue.phone}`}
                            className="btn btn-secondary"
                        >
                            Call Venue
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <section className="card">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Shows</h2>
            <div className="space-y-4">
                {venue.shows.map((show, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-lg">
                        <div className="flex items-center gap-3">
                            <Calendar size={20} />
                            <div>
                                <div className="font-medium">{show.date}</div>
                                <div className="text-sm text-[var(--muted-foreground)]">{show.status}</div>
                            </div>
                        </div>
                        {show.ticketUrl && (
                            <a href={show.ticketUrl} className="btn btn-primary">
                                Buy Tickets
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </section>
    </Main>
);

export default VenueDetail;