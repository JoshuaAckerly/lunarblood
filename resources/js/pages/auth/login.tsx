import React, { FormEvent, useEffect } from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import Main from '@/layouts/main';
import Seo from '@/components/Seo';

interface PageProps {
    [key: string]: unknown;
    status?: string;
}

const Login: React.FC = () => {
    const { status } = usePage<PageProps>().props;

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/login', {
            onFinish: () => form.reset('password'),
        });
    };

    useEffect(() => {
        return () => {
            form.reset('password');
        };
    }, []);

    return (
        <Main>
            <Head title="Log in" />

            <Seo
                title="Login"
                description="Log in to your Lunarblood account."
                keywords="login, account, Lunarblood"
                ogType="website"
                canonical="https://lunarblood.graveyardjokes.com/login"
            />

            <section className="max-w-md mx-auto px-4">
                <h1 className="page-title !text-2xl md:!text-3xl !mb-2">Log in</h1>
                <p className="text-[var(--muted-foreground)] mb-6">Welcome back! Please sign in to your account.</p>

                {status && (
                    <div className="mb-4 p-4 bg-[var(--accent)] border border-[var(--border)] rounded-md">
                        <p className="text-sm">{status}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="card space-y-4">
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
                            autoFocus
                        />
                        {form.errors.email && (
                            <p className="text-sm text-[var(--destructive)] mt-2">{form.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={form.data.password}
                            onChange={(event) => form.setData('password', event.target.value)}
                            className="input-field"
                            required
                            autoComplete="current-password"
                        />
                        {form.errors.password && (
                            <p className="text-sm text-[var(--destructive)] mt-2">{form.errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={form.data.remember}
                            onChange={(event) => form.setData('remember', event.target.checked)}
                            className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm">
                            Remember me
                        </label>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <a
                            href="/forgot-password"
                            className="text-sm text-[var(--primary)] hover:underline"
                        >
                            Forgot your password?
                        </a>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="btn btn-primary"
                        >
                            {form.processing ? 'Logging in...' : 'Log in'}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-6 text-sm text-[var(--muted-foreground)]">
                    Don't have an account?{' '}
                    <a href="/register" className="text-[var(--primary)] hover:underline">
                        Sign up
                    </a>
                </p>
            </section>
        </Main>
    );
};

export default Login;