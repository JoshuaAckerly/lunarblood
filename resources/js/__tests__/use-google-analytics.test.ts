import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGoogleAnalytics } from '../hooks/use-google-analytics';

// Capture the navigate callback registered via router.on
let navigateCallback: (() => void) | null = null;

vi.mock('@inertiajs/react', () => ({
    router: {
        on: vi.fn((event: string, cb: () => void) => {
            if (event === 'navigate') navigateCallback = cb;
            // return a cleanup function (mirrors the real router.on API)
            return () => {
                navigateCallback = null;
            };
        }),
    },
}));

describe('useGoogleAnalytics', () => {
    beforeEach(() => {
        navigateCallback = null;
        window.gtag = vi.fn();
        // jsdom doesn't set these, so provide sensible defaults
        Object.defineProperty(window, 'location', {
            value: { pathname: '/test', search: '' },
            writable: true,
        });
        Object.defineProperty(document, 'title', {
            value: 'Test Page',
            writable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete window.gtag;
    });

    it('registers a navigate listener on mount', () => {
        const { unmount } = renderHook(() => useGoogleAnalytics());
        expect(navigateCallback).not.toBeNull();
        unmount();
    });

    it('fires gtag page_view with correct path and title on navigate', () => {
        renderHook(() => useGoogleAnalytics());

        navigateCallback!();

        expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
            page_path: '/test',
            page_title: 'Test Page',
        });
    });

    it('does not throw when gtag is not defined', () => {
        delete window.gtag;
        renderHook(() => useGoogleAnalytics());
        expect(() => navigateCallback!()).not.toThrow();
    });

    it('removes the navigate listener on unmount', () => {
        const { unmount } = renderHook(() => useGoogleAnalytics());
        unmount();
        expect(navigateCallback).toBeNull();
    });
});
