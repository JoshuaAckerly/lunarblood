import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

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
            host: '10.0.1.30',
            origin: 'http://lunarblood.graveyardjokes.local:8083',
            cors: {
                origin: 'http://lunarblood.graveyardjokes.local',
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
            },
        },
        ssr: {
            noExternal: ['react', 'react-dom', '@inertiajs/react', '@inertiajs/core'],
        },
    };
});
