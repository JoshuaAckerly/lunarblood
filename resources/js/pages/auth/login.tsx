import Input from '@/components/Input';
import Seo from '@/components/Seo';
import Main from '@/layouts/main';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { FormEvent, useEffect } from 'react';

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

            <section className="mx-auto max-w-md px-4">
                <h1 className="page-title !mb-2 !text-2xl md:!text-3xl">Log in</h1>
                <p className="mb-6 text-[var(--muted-foreground)]">Welcome back! Please sign in to your account.</p>

                {status && (
                    <div className="mb-4 rounded-md border border-[var(--border)] bg-[var(--accent)] p-4">
                        <p className="text-sm">{status}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="card space-y-4">
                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                        error={form.errors.email}
                        required
                        autoComplete="email"
                        autoFocus
                    />

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                        error={form.errors.password}
                        required
                        autoComplete="current-password"
                    />

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
                        <a href="/forgot-password" className="text-sm text-[var(--primary)] hover:underline">
                            Forgot your password?
                        </a>
                        <button type="submit" disabled={form.processing} className="btn btn-primary">
                            {form.processing ? 'Logging in...' : 'Log in'}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
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
