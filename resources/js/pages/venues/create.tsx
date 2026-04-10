import Input from '@/components/Input';
import Seo from '@/components/Seo';
import Textarea from '@/components/Textarea';
import Main from '@/layouts/main';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import React from 'react';

const CreateVenue: React.FC = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        city: '',
        state: '',
        country: 'US',
        address: '',
        capacity: '',
        website: '',
        phone: '',
        description: '',
        image: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/venues');
    };

    return (
        <Main>
            <Seo title="Add New Venue" description="Add a new venue to the Lunar Blood performance database." />

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
                    <h1 className="mb-6 text-2xl font-bold">Add New Venue</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Input
                                id="name"
                                label="Venue Name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />

                            <Input
                                id="capacity"
                                label="Capacity"
                                type="number"
                                value={data.capacity}
                                onChange={(e) => setData('capacity', e.target.value)}
                                error={errors.capacity}
                                placeholder="e.g. 500"
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <Input
                                id="city"
                                label="City"
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                error={errors.city}
                                required
                            />

                            <Input
                                id="state"
                                label="State"
                                type="text"
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value)}
                                error={errors.state}
                                placeholder="e.g. WA"
                            />

                            <Input
                                id="country"
                                label="Country"
                                type="text"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                error={errors.country}
                                required
                            />
                        </div>

                        <Textarea
                            id="address"
                            label="Full Address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            error={errors.address}
                            rows={3}
                            required
                        />

                        <div className="grid gap-6 md:grid-cols-2">
                            <Input
                                id="website"
                                label="Website"
                                type="url"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                error={errors.website}
                                placeholder="https://venue.com"
                            />

                            <Input
                                id="phone"
                                label="Phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                error={errors.phone}
                                placeholder="(206) 555-0123"
                            />
                        </div>

                        <Textarea
                            id="description"
                            label="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            error={errors.description}
                            rows={4}
                            placeholder="Describe the venue, atmosphere, acoustics, etc."
                        />

                        <Input
                            id="image"
                            label="Image URL"
                            type="url"
                            value={data.image}
                            onChange={(e) => setData('image', e.target.value)}
                            error={errors.image}
                            placeholder="https://example.com/venue-image.jpg"
                        />

                        <div className="flex gap-4 border-t pt-6">
                            <Link href="/venues" className="btn btn-secondary">
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing} className="btn btn-primary">
                                <Save size={16} className="mr-2" />
                                {processing ? 'Creating...' : 'Create Venue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Main>
    );
};

export default CreateVenue;
