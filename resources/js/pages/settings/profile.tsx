import React, { FormEvent, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Main from '@/layouts/main';
import Seo from '@/components/Seo';

interface AuthUser {
    name: string;
    email: string;
}

interface PageProps {
    [key: string]: unknown;
    auth: {
        user: AuthUser;
    };
}

const ProfileSettings: React.FC = () => {
    const { auth } = usePage<PageProps>().props;
    const [saved, setSaved] = useState(false);

    const form = useForm({
        name: auth.user?.name ?? '',
        email: auth.user?.email ?? '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaved(false);

        form.patch('/settings/profile', {
            preserveScroll: true,
            onSuccess: () => setSaved(true),
        });
    };

    return (
        <Main>
            <Seo
                title="Profile Settings"
                description="Manage your Lunarblood profile details."
                keywords="profile settings, account, Lunarblood"
                ogType="website"
                canonical="https://lunarblood.graveyardjokes.com/settings/profile"
            />

            <section className="max-w-2xl mx-auto px-4">
                <h1 className="page-title !text-2xl md:!text-3xl !mb-2">Profile Settings</h1>
                <p className="text-[var(--muted-foreground)] mb-6">Update your account name and email address.</p>

                <form onSubmit={handleSubmit} className="card space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                            className="input-field"
                            required
                            autoComplete="name"
                        />
                        {form.errors.name && (
                            <p className="text-sm text-[var(--destructive)] mt-2">{form.errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={(event) => form.setData('email', event.target.value)}
                            className="input-field"
                            required
                            autoComplete="email"
                        />
                        {form.errors.email && (
                            <p className="text-sm text-[var(--destructive)] mt-2">{form.errors.email}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <p className="text-sm text-[var(--muted-foreground)]">Changes apply immediately after save.</p>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="btn btn-primary"
                        >
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    {saved && <p className="text-sm text-[var(--accent)]">Profile updated successfully.</p>}
                </form>
            </section>
        </Main>
    );
};

export default ProfileSettings;
