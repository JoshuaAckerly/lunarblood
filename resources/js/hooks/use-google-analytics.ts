/**
 * Google Analytics 4 Event Tracking
 * Provides GA4 event tracking functions for eCommerce conversions
 */

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

/**
 * Track a view_item event when a product is viewed
 */
export const trackViewItem = (product: { id: number | string; name: string; price: number; category: string }) => {
    if (window.gtag) {
        window.gtag('event', 'view_item', {
            currency: 'USD',
            items: [
                {
                    item_id: product.id,
                    item_name: product.name,
                    price: product.price,
                    item_category: product.category,
                },
            ],
        });
    }
};

/**
 * Track an add_to_cart event when a user adds a product to checkout
 */
export const trackAddToCart = (product: { id: number | string; name: string; price: number; category: string; quantity: number }) => {
    if (window.gtag) {
        window.gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: product.price * product.quantity,
            items: [
                {
                    item_id: product.id,
                    item_name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    item_category: product.category,
                },
            ],
        });
    }
};

/**
 * Track a begin_checkout event when user starts checkout process
 */
export const trackBeginCheckout = (product: { id: number | string; name: string; price: number; quantity: number; total: number }) => {
    if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
            currency: 'USD',
            value: product.total,
            items: [
                {
                    item_id: product.id,
                    item_name: product.name,
                    quantity: product.quantity,
                    price: product.price,
                },
            ],
        });
    }
};

/**
 * Track a purchase event on successful order completion
 */
export const trackPurchase = (orderData: {
    productId: string | number;
    name: string;
    price: number;
    quantity: number;
    total: number;
    transactionId?: string;
    email?: string;
}) => {
    if (window.gtag) {
        window.gtag('event', 'purchase', {
            transaction_id: orderData.transactionId || `order-${Date.now()}`,
            affiliation: 'Lunar Blood Shop',
            currency: 'USD',
            value: orderData.total,
            tax: 0,
            shipping: 0,
            items: [
                {
                    item_id: orderData.productId,
                    item_name: orderData.name,
                    price: orderData.price,
                    quantity: orderData.quantity,
                    item_category: 'Band Merchandise',
                },
            ],
        });
    }
};

/**
 * Track a form submission event
 */
export const trackFormSubmission = (formName: string) => {
    if (window.gtag) {
        window.gtag('event', 'form_submit', {
            form_name: formName,
        });
    }
};

/**
 * Track a button click event
 */
export const trackButtonClick = (buttonName: string, category?: string) => {
    if (window.gtag) {
        window.gtag('event', 'button_click', {
            button_name: buttonName,
            button_category: category || 'general',
        });
    }
};

/**
 * Initialize Google Analytics with the measurement ID
 */
export const initializeGoogleAnalytics = (measurementId: string) => {
    if (!measurementId) {
        console.warn('Google Analytics: Measurement ID not configured');
        return;
    }

    // Load the GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
        window.dataLayer!.push(...args);
    }
    gtag('js', new Date());
    gtag('config', measurementId, {
        allow_google_signals: true,
        allow_ad_personalization_signals: true,
    });

    // Make gtag global
    window.gtag = gtag;
};
