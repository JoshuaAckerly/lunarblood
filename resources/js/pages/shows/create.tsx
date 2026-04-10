import FormField from '@/components/FormField';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';
import Seo from '@/components/Seo';
import Main from '@/layouts/main';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Calendar, Clock, DollarSign, Eye, MapPin, Save } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface Venue {
    id: number;
    name: string;
    city: string;
    state?: string;
    country: string;
}

interface CreateShowProps {
    step: number;
    venues: Venue[];
    draftData: Record<string, string | number | null | undefined>;
}

const CreateShow: React.FC<CreateShowProps> = ({ step: initialStep, venues, draftData }) => {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [isPreview, setIsPreview] = useState(false);
    const [autosaveState, setAutosaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [manualSaveState, setManualSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const { data, setData, post, processing, errors } = useForm({
        venue_id: draftData.venue_id || '',
        date: draftData.date || '',
        time: draftData.time || '',
        status: draftData.status || 'coming-soon',
        price: draftData.price || '',
        description: draftData.description || '',
        ticket_url: draftData.ticket_url || '',
        step: currentStep,
        action: 'next',
    });

    const csrfToken = useMemo(() => {
        return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';
    }, []);

    useEffect(() => {
        setCurrentStep(initialStep);
        setData('step', initialStep);
    }, [initialStep, setData]);

    const steps = [
        { id: 1, title: 'Basic Info', description: 'Venue and date/time' },
        { id: 2, title: 'Details', description: 'Status and description' },
        { id: 3, title: 'Tickets & Publish', description: 'Pricing and final review' },
    ];

    const saveDraft = async (isManual = false) => {
        if (!csrfToken) {
            if (isManual) {
                setManualSaveState('error');
            } else {
                setAutosaveState('error');
            }
            return;
        }

        if (isManual) {
            setManualSaveState('saving');
        } else {
            setAutosaveState('saving');
        }

        try {
            const response = await fetch('/shows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    ...data,
                    step: currentStep,
                    action: 'save_draft',
                }),
            });

            if (!response.ok) {
                throw new Error('Draft save failed');
            }

            if (isManual) {
                setManualSaveState('saved');
                window.setTimeout(() => setManualSaveState('idle'), 2000);
            } else {
                setAutosaveState('saved');
                window.setTimeout(() => setAutosaveState('idle'), 1500);
            }
        } catch {
            if (isManual) {
                setManualSaveState('error');
            } else {
                setAutosaveState('error');
            }
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void saveDraft(false);
        }, 1500);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [data.venue_id, data.date, data.time, data.status, data.price, data.description, data.ticket_url, currentStep]);

    const handleNext = () => {
        if (currentStep < 3) {
            setData('action', 'next');
            setData('step', currentStep);
            post('/shows', { preserveScroll: true });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            window.location.href = `/shows/create?step=${currentStep - 1}`;
        }
    };

    const handleSaveDraft = () => {
        void saveDraft(true);
    };

    const handlePublish = () => {
        setData('action', 'publish');
        post('/shows');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/shows');
    };

    const selectedVenue = venues.find((v) => v.id === parseInt(String(data.venue_id)));

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <Select
                            id="venue_id"
                            label="Venue"
                            value={data.venue_id}
                            onChange={(e) => setData('venue_id', e.target.value)}
                            error={errors.venue_id}
                            required
                        >
                            <option value="">Select a venue</option>
                            {venues.map((venue) => (
                                <option key={venue.id} value={venue.id}>
                                    {venue.name} - {venue.city}, {venue.state} {venue.country}
                                </option>
                            ))}
                        </Select>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Input
                                id="date"
                                label="Date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                error={errors.date}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />

                            <Input
                                id="time"
                                label="Time"
                                type="time"
                                value={data.time}
                                onChange={(e) => setData('time', e.target.value)}
                                error={errors.time}
                                required
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <Select
                            id="status"
                            label="Status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            error={errors.status}
                            required
                        >
                            <option value="coming-soon">Coming Soon</option>
                            <option value="on-sale">On Sale</option>
                            <option value="sold-out">Sold Out</option>
                            <option value="cancelled">Cancelled</option>
                        </Select>

                        <FormField id="price" label="Price (optional)" error={errors.price}>
                            <div className="relative">
                                <DollarSign size={16} className="absolute top-1/2 left-3 -translate-y-1/2 transform text-[var(--muted-foreground)]" />
                                <input
                                    type="number"
                                    id="price"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </FormField>

                        <Textarea
                            id="description"
                            label="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            error={errors.description}
                            rows={4}
                            placeholder="Describe the show, special guests, setlist, etc."
                        />
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <Input
                            id="ticket_url"
                            label="Ticket URL"
                            type="url"
                            value={data.ticket_url}
                            onChange={(e) => setData('ticket_url', e.target.value)}
                            error={errors.ticket_url}
                            placeholder="https://tickets.example.com"
                        />

                        {isPreview ? (
                            <div className="card bg-[var(--muted)]">
                                <h3 className="mb-4 text-lg font-semibold">Preview</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} />
                                        <span className="font-medium">{selectedVenue?.name || 'Venue not set'}</span>
                                        <span className="text-[var(--muted-foreground)]">
                                            {selectedVenue ? `${selectedVenue.city}, ${selectedVenue.state || ''} ${selectedVenue.country}` : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} />
                                        <span>{data.date ? new Date(data.date).toLocaleDateString() : 'Date not set'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock size={20} />
                                        <span>{data.time || 'Time not set'}</span>
                                    </div>
                                    {data.price && (
                                        <div className="flex items-center gap-3">
                                            <DollarSign size={20} />
                                            <span>${data.price}</span>
                                        </div>
                                    )}
                                    <div className="mt-4">
                                        <span
                                            className={`rounded px-2 py-1 text-sm ${
                                                data.status === 'on-sale'
                                                    ? 'bg-green-100 text-green-800'
                                                    : data.status === 'sold-out'
                                                      ? 'bg-red-100 text-red-800'
                                                      : data.status === 'cancelled'
                                                        ? 'bg-gray-100 text-gray-800'
                                                        : 'bg-blue-100 text-blue-800'
                                            }`}
                                        >
                                            {String(data.status).replace('-', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    {data.description && (
                                        <div className="mt-4">
                                            <p className="text-[var(--muted-foreground)]">{data.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-[var(--muted-foreground)]">Use Preview Mode to review event details before publishing.</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Main>
            <Seo title="Create New Show" description="Create a new Lunar Blood show event." />

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
                    <h1 className="mb-6 text-2xl font-bold">Create New Show</h1>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            {steps.map((stepItem, index) => (
                                <React.Fragment key={stepItem.id}>
                                    <div
                                        className={`flex flex-col items-center ${
                                            stepItem.id <= currentStep ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
                                        }`}
                                    >
                                        <div
                                            className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                                stepItem.id < currentStep
                                                    ? 'bg-[var(--primary)] text-white'
                                                    : stepItem.id === currentStep
                                                      ? 'bg-[var(--primary)] text-white'
                                                      : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                                            }`}
                                        >
                                            {stepItem.id < currentStep ? '✓' : stepItem.id}
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-medium">{stepItem.title}</div>
                                            <div className="text-xs">{stepItem.description}</div>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`mx-4 h-px flex-1 ${stepItem.id < currentStep ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 text-sm text-[var(--muted-foreground)]">
                        {autosaveState === 'saving' && 'Auto-saving draft...'}
                        {autosaveState === 'saved' && 'Draft auto-saved'}
                        {autosaveState === 'error' && 'Auto-save failed. You can still use Save Draft.'}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {renderStepContent()}

                        <div className="mt-8 flex items-center justify-between border-t pt-6">
                            <div className="flex gap-3">
                                <button type="button" onClick={handleSaveDraft} disabled={processing} className="btn btn-secondary">
                                    <Save size={16} className="mr-2" />
                                    {manualSaveState === 'saving' ? 'Saving...' : 'Save Draft'}
                                </button>
                                {currentStep === 3 && (
                                    <button type="button" onClick={() => setIsPreview(!isPreview)} className="btn btn-secondary">
                                        <Eye size={16} className="mr-2" />
                                        {isPreview ? 'Hide' : 'Show'} Preview
                                    </button>
                                )}

                                {manualSaveState === 'saved' && <span className="self-center text-sm text-[var(--muted-foreground)]">Saved</span>}
                                {manualSaveState === 'error' && <span className="self-center text-sm text-red-500">Save failed</span>}
                            </div>

                            <div className="flex gap-3">
                                {currentStep > 1 && (
                                    <button type="button" onClick={handlePrevious} className="btn btn-secondary">
                                        <ArrowLeft size={16} className="mr-2" />
                                        Previous
                                    </button>
                                )}

                                {currentStep < 3 ? (
                                    <button type="button" onClick={handleNext} disabled={processing} className="btn btn-primary">
                                        Next
                                        <ArrowRight size={16} className="ml-2" />
                                    </button>
                                ) : (
                                    <button type="button" onClick={handlePublish} disabled={processing || !isPreview} className="btn btn-primary">
                                        <Save size={16} className="mr-2" />
                                        {processing ? 'Publishing...' : 'Publish Show'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Main>
    );
};

export default CreateShow;
