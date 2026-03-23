import Seo from '@/components/Seo';
import Main from '@/layouts/main';
import { Head, useForm } from '@inertiajs/react';
import React, { FormEvent, useEffect } from 'react';

const Register: React.FC = () => {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/register', {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    useEffect(() => {
        return () => {
            form.reset('password', 'password_confirmation');
        };
    }, []);

    return (
        <Main>
            <Head title="Register" />

            <Seo
                title="Register"
                description="Create your Lunarblood account."
                keywords="register, signup, account, Lunarblood"
                ogType="website"
                canonical="https://lunarblood.graveyardjokes.com/register"
            />

            <section className="mx-auto max-w-md px-4">
                <h1 className="page-title !mb-2 !text-2xl md:!text-3xl">Create Account</h1>
                <p className="mb-6 text-[var(--muted-foreground)]">Join the Lunarblood community.</p>

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
                            autoFocus
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

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={form.data.password}
                            onChange={(event) => form.setData('password', event.target.value)}
                            className="input-field"
                            required
                            autoComplete="new-password"
                        />
                        {form.errors.password && <p className="mt-2 text-sm text-[var(--destructive)]">{form.errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium">
                            Confirm Password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={form.data.password_confirmation}
                            onChange={(event) => form.setData('password_confirmation', event.target.value)}
                            className="input-field"
                            required
                            autoComplete="new-password"
                        />
                        {form.errors.password_confirmation && (
                            <p className="mt-2 text-sm text-[var(--destructive)]">{form.errors.password_confirmation}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <p className="text-sm text-[var(--muted-foreground)]">Already have an account?</p>
                        <button type="submit" disabled={form.processing} className="btn btn-primary">
                            {form.processing ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
                    By creating an account, you agree to our{' '}
                    <a href="/terms" className="text-[var(--primary)] hover:underline">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-[var(--primary)] hover:underline">
                        Privacy Policy
                    </a>
                    .
                </p>
            </section>
        </Main>
    );
};

export default Register;
