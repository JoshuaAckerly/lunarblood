import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import type { UserConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    let server;
    if (env.VITE_SERVER_ENV === 'production') {
        server = {
            port: 443,
            host: '0.0.0.0',
            origin: 'https://lunarblood.graveyardjokes.com',
            allowedHosts: ['lunarblood.graveyardjokes.com'],
        };
    } else if (env.VITE_SERVER_ENV === 'test' || env.VITE_SERVER_ENV === 'testing') {
        server = {
            port: 8083,
            host: '127.0.0.1',
            origin: 'http://lunarblood.graveyardjokes.testing:8083',
            allowedHosts: ['lunarblood.graveyardjokes.testing'],
        };
    } else {
        // default: local/development
        server = {
            port: 8083,
            host: '0.0.0.0',
            origin: 'http://lunarblood.graveyardjokes.local:8083',
            cors: {
                origin: [
                    'http://lunarblood.graveyardjokes.local',
                    'http://lunarblood.graveyardjokes.local:8002',
                    'http://localhost:8002',
                ],
                credentials: true
            },
            allowedHosts: ['lunarblood.graveyardjokes.local'],
        };
    }

    return {
        server,
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                ssr: 'resources/js/ssr.tsx',
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
        esbuild: {
            jsx: 'automatic',
        },
        resolve: {
            alias: {
                'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
                '@': resolve(__dirname, 'resources/js'),
                '@/images': resolve(__dirname, 'resources/images'),
                '@gj/env': resolve(__dirname, '../packages/env/src/index.ts'),
                '@gj/utils': resolve(__dirname, '../packages/utils/src/index.ts'),
                '@gj/hooks': resolve(__dirname, '../packages/hooks/src/index.ts'),
            },
            dedupe: ['react', 'react-dom'],
        },
        ssr: {
            noExternal: ['react', 'react-dom', '@inertiajs/react', '@inertiajs/core'],
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom'],
                        inertia: ['@inertiajs/react', '@inertiajs/core'],
                        sentry: ['@sentry/react'],
                    },
                },
            },
        },
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['resources/js/__tests__/setup.ts'],
            include: ['resources/js/__tests__/**/*.{test,spec}.{ts,tsx}'],
            alias: {
                '@': resolve(__dirname, 'resources/js'),
            },
        } satisfies UserConfig['test'],
    };
});
