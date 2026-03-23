import Seo from '@/components/Seo';
import Main from '@/layouts/main';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import React from 'react';

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
}

interface EditVenueProps {
    venue: Venue;
}

const EditVenue: React.FC<EditVenueProps> = ({ venue }) => {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        delete: destroy,
    } = useForm({
        name: venue.name,
        city: venue.city,
        state: venue.state || '',
        country: venue.country,
        address: venue.address,
        capacity: venue.capacity?.toString() || '',
        website: venue.website || '',
        phone: venue.phone || '',
        description: venue.description || '',
        image: venue.image || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/venues/${venue.id}`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
            destroy(`/venues/${venue.id}`);
        }
    };

    return (
        <Main>
            <Seo title={`Edit ${venue.name}`} description={`Edit venue information for ${venue.name}.`} />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <Link
                        href="/venues"
                        className="inline-flex items-center gap-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                    >
                        <ArrowLeft size={16} />
                        Back to Venues
                    </Link>
                </div>

                <div className="card">
                    <h1 className="mb-6 text-2xl font-bold">Edit Venue</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                    Venue Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="input w-full"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="capacity" className="mb-2 block text-sm font-medium">
                                    Capacity
                                </label>
                                <input
                                    type="number"
                                    id="capacity"
                                    value={data.capacity}
                                    onChange={(e) => setData('capacity', e.target.value)}
                                    className="input w-full"
                                    placeholder="e.g. 500"
                                />
                                {errors.capacity && <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div>
                                <label htmlFor="city" className="mb-2 block text-sm font-medium">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="input w-full"
                                    required
                                />
                                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                            </div>

                            <div>
                                <label htmlFor="state" className="mb-2 block text-sm font-medium">
                                    State
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    value={data.state}
                                    onChange={(e) => setData('state', e.target.value)}
                                    className="input w-full"
                                    placeholder="e.g. WA"
                                />
                                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                            </div>

                            <div>
                                <label htmlFor="country" className="mb-2 block text-sm font-medium">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    className="input w-full"
                                    required
                                />
                                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="mb-2 block text-sm font-medium">
                                Full Address *
                            </label>
                            <textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="input w-full"
                                rows={3}
                                required
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="website" className="mb-2 block text-sm font-medium">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    className="input w-full"
                                    placeholder="https://venue.com"
                                />
                                {errors.website && <p className="mt-1 text-sm text-red-500">{errors.website}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="input w-full"
                                    placeholder="(206) 555-0123"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="mb-2 block text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="input w-full"
                                rows={4}
                                placeholder="Describe the venue, atmosphere, acoustics, etc."
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div>
                            <label htmlFor="image" className="mb-2 block text-sm font-medium">
                                Image URL
                            </label>
                            <input
                                type="url"
                                id="image"
                                value={data.image}
                                onChange={(e) => setData('image', e.target.value)}
                                className="input w-full"
                                placeholder="https://example.com/venue-image.jpg"
                            />
                            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                        </div>

                        <div className="flex gap-4 border-t pt-6">
                            <Link href="/venues" className="btn btn-secondary">
                                Cancel
                            </Link>
                            <button type="button" onClick={handleDelete} className="btn btn-danger">
                                <Trash2 size={16} className="mr-2" />
                                Delete
                            </button>
                            <button type="submit" disabled={processing} className="btn btn-primary">
                                <Save size={16} className="mr-2" />
                                {processing ? 'Updating...' : 'Update Venue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Main>
    );
};

export default EditVenue;
