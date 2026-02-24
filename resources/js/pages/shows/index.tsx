import React from "react";
import { usePage, Link } from "@inertiajs/react";
import Main from "@/layouts/main";
import Seo from "@/components/Seo";
import { Plus, Calendar, MapPin, Clock, DollarSign, Edit, Eye, Trash2 } from "lucide-react";

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
    const { flash } = usePage().props as any;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'on-sale':
                return 'bg-green-100 text-green-800';
            case 'sold-out':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <Main>
            <Seo
                title="Shows Management"
                description="Manage Lunar Blood shows and events."
            />

            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Shows Management</h1>
                    <Link
                        href="/shows/create"
                        className="btn btn-primary"
                    >
                        <Plus size={16} className="mr-2" />
                        Create New Show
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {flash.success}
                    </div>
                )}

                {shows.length === 0 ? (
                    <div className="card text-center py-12">
                        <Calendar size={48} className="mx-auto text-[var(--muted-foreground)] mb-4" />
                        <h3 className="text-lg font-medium mb-2">No shows yet</h3>
                        <p className="text-[var(--muted-foreground)] mb-6">
                            Get started by creating your first show event.
                        </p>
                        <Link
                            href="/shows/create"
                            className="btn btn-primary"
                        >
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
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-semibold">
                                                {show.venue.name}
                                            </h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(show.status)}`}>
                                                {show.status.replace('-', ' ').toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                                            <div className="flex items-center gap-2 text-sm mb-3">
                                                <DollarSign size={16} className="text-[var(--muted-foreground)]" />
                                                <span className="font-medium">${show.price}</span>
                                            </div>
                                        )}

                                        {show.description && (
                                            <p className="text-[var(--muted-foreground)] text-sm mb-4 line-clamp-2">
                                                {show.description}
                                            </p>
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

                                    <div className="flex items-center gap-2 ml-4">
                                        <Link
                                            href={`/shows/${show.id}`}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <Eye size={14} />
                                        </Link>
                                        <Link
                                            href={`/shows/${show.id}/edit`}
                                            className="btn btn-secondary btn-sm"
                                        >
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