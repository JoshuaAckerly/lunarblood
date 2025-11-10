import React from "react";
import Main from "@/layouts/main";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";

const tourDates = [
    {
        id: 1,
        date: "2024-03-15",
        city: "Seattle, WA",
        venue: "The Underground",
        time: "8:00 PM",
        status: "on-sale",
        ticketUrl: "https://tickets.com/lunar-blood-seattle"
    },
    {
        id: 2,
        date: "2024-04-02",
        city: "Portland, OR", 
        venue: "Dark Moon Club",
        time: "9:00 PM",
        status: "on-sale",
        ticketUrl: "https://tickets.com/lunar-blood-portland"
    },
    {
        id: 3,
        date: "2024-04-20",
        city: "San Francisco, CA",
        venue: "Crimson Hall",
        time: "8:30 PM",
        status: "sold-out"
    },
    {
        id: 4,
        date: "2024-05-10",
        city: "Los Angeles, CA",
        venue: "Shadow Lounge",
        time: "9:00 PM",
        status: "coming-soon"
    }
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
    });
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'on-sale': return 'text-green-400';
        case 'sold-out': return 'text-red-400';
        case 'coming-soon': return 'text-yellow-400';
        default: return 'text-[var(--muted-foreground)]';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'on-sale': return 'On Sale';
        case 'sold-out': return 'Sold Out';
        case 'coming-soon': return 'Coming Soon';
        default: return status;
    }
};

const Tour: React.FC = () => (
    <Main>
        <section className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Tour Dates</h1>
            <p className="text-[var(--muted-foreground)] mb-8">
                Experience Lunar Blood live - dark atmospheres and crushing riffs in intimate venues
            </p>
        </section>

        <section className="mb-12">
            <div className="space-y-4">
                {tourDates.map((show) => (
                    <div key={show.id} className="card hover:shadow-xl transition-shadow">
                        {/* Mobile Layout */}
                        <div className="block md:hidden space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-lg font-semibold">{formatDate(show.date)}</div>
                                    <div className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
                                        <Clock size={14} />
                                        {show.time}
                                    </div>
                                </div>
                                <span className={`text-sm font-medium ${getStatusColor(show.status)}`}>
                                    {getStatusText(show.status)}
                                </span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin size={16} />
                                    <span className="font-medium">{show.city}</span>
                                </div>
                                <div className="text-[var(--muted-foreground)] ml-6">{show.venue}</div>
                            </div>
                            <div>
                                {show.status === 'on-sale' && show.ticketUrl ? (
                                    <a 
                                        href={show.ticketUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary w-full"
                                    >
                                        Buy Tickets
                                    </a>
                                ) : show.status === 'sold-out' ? (
                                    <button className="btn btn-secondary w-full" disabled>
                                        Sold Out
                                    </button>
                                ) : (
                                    <button className="btn btn-secondary w-full" disabled>
                                        Coming Soon
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-2">
                                <div className="text-lg font-semibold">{formatDate(show.date)}</div>
                                <div className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
                                    <Clock size={14} />
                                    {show.time}
                                </div>
                            </div>
                            
                            <div className="col-span-3">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span className="font-medium">{show.city}</span>
                                </div>
                            </div>
                            
                            <div className="col-span-3">
                                <div className="text-[var(--muted-foreground)]">{show.venue}</div>
                            </div>
                            
                            <div className="col-span-2">
                                <span className={`text-sm font-medium ${getStatusColor(show.status)}`}>
                                    {getStatusText(show.status)}
                                </span>
                            </div>
                            
                            <div className="col-span-2 text-right">
                                {show.status === 'on-sale' && show.ticketUrl ? (
                                    <a 
                                        href={show.ticketUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        Buy Tickets
                                    </a>
                                ) : show.status === 'sold-out' ? (
                                    <button className="btn btn-secondary" disabled>
                                        Sold Out
                                    </button>
                                ) : (
                                    <button className="btn btn-secondary" disabled>
                                        Coming Soon
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
            <div className="card">
                <h2 className="text-2xl font-semibold mb-4">VIP Packages</h2>
                <p className="text-[var(--muted-foreground)] mb-4">
                    Get exclusive access with our VIP experience packages including meet & greet, 
                    signed merchandise, and early venue entry.
                </p>
                <a href="#vip" className="btn btn-primary">
                    Learn More
                </a>
            </div>
            
            <div className="card">
                <h2 className="text-2xl font-semibold mb-4">Tour Updates</h2>
                <p className="text-[var(--muted-foreground)] mb-4">
                    Stay updated on new tour dates, venue changes, and exclusive presale opportunities.
                </p>
                <a href="#newsletter" className="btn btn-secondary">
                    Subscribe to Updates
                </a>
            </div>
        </section>
    </Main>
);

export default Tour;