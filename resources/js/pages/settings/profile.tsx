import Seo from '@/components/Seo';
import Main from '@/layouts/main';
import { useForm, usePage } from '@inertiajs/react';
import React, { FormEvent, useState } from 'react';

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

            <section className="mx-auto max-w-2xl px-4">
                <h1 className="page-title !mb-2 !text-2xl md:!text-3xl">Profile Settings</h1>
                <p className="mb-6 text-[var(--muted-foreground)]">Update your account name and email address.</p>

                <form onSubmit={handleSubmit} className="card space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-medium">
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
                        {form.errors.name && <p className="mt-2 text-sm text-[var(--destructive)]">{form.errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium">
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
                        {form.errors.email && <p className="mt-2 text-sm text-[var(--destructive)]">{form.errors.email}</p>}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <p className="text-sm text-[var(--muted-foreground)]">Changes apply immediately after save.</p>
                        <button type="submit" disabled={form.processing} className="btn btn-primary">
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
