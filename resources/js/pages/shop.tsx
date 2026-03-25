import Seo from '@/components/Seo';
import Main from '@/layouts/main';
import { ShoppingCart } from 'lucide-react';
import React, { useState } from 'react';

// Use CDN in production, local images in development
const cdn = import.meta.env.VITE_ASSET_URL || '';
const getImageUrl = (path: string) => (cdn ? `${cdn}${path}` : path);

const products = [
    {
        id: 1,
        name: 'Lunar Blood T-Shirt',
        price: 25.0,
        category: 'Apparel',
        image: getImageUrl('/images/tshirt.jpg'),
        description: 'Black cotton tee with band logo',
    },
    {
        id: 2,
        name: 'Blood Moon Vinyl',
        price: 35.0,
        category: 'Music',
        image: getImageUrl('/images/vinyl.jpg'),
        description: 'Limited edition red vinyl LP',
    },
    {
        id: 3,
        name: 'Dark Horizons Hoodie',
        price: 45.0,
        category: 'Apparel',
        image: getImageUrl('/images/hoodie.jpg'),
        description: 'Premium black hoodie with album art',
    },
    {
        id: 4,
        name: 'Band Patch Set',
        price: 15.0,
        category: 'Accessories',
        image: getImageUrl('/images/patches.jpg'),
        description: 'Set of 3 embroidered patches',
    },
    {
        id: 5,
        name: 'Shadows & Echoes CD',
        price: 20.0,
        category: 'Music',
        image: getImageUrl('/images/cd.jpg'),
        description: 'Latest EP in jewel case',
    },
    {
        id: 6,
        name: 'Logo Beanie',
        price: 18.0,
        category: 'Accessories',
        image: getImageUrl('/images/beanie.jpg'),
        description: 'Embroidered logo beanie',
    },
];

const Shop: React.FC = () => {
    const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

    return (
        <Main>
            <Seo
                title="Shop - Official Merch & Music"
                description="Buy official Lunar Blood merchandise including band t-shirts, hoodies, vinyl records, CDs, patches, and accessories. Support the band with authentic merch."
                keywords="Lunar Blood merch, band merchandise, metal t-shirts, vinyl records, band hoodie, music merchandise, metal accessories"
                ogType="website"
                canonical="https://lunarblood.graveyardjokes.com/shop"
            />
            <section className="page-header">
                <h1 className="page-title">Shop</h1>
                <p className="page-subtitle">Official Lunar Blood merchandise and music</p>
            </section>

            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product.id} className="card group transition-shadow hover:shadow-xl">
                        <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-[var(--muted)]">
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--accent)] to-[var(--muted)]">
                                <span className="text-[var(--muted-foreground)]">Product Image</span>
                            </div>
                        </div>

                        <div className="mb-2">
                            <span className="text-xs tracking-wide text-[var(--muted-foreground)] uppercase">{product.category}</span>
                        </div>

                        <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
                        <p className="mb-4 text-sm text-[var(--muted-foreground)]">{product.description}</p>

                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                            <a
                                href={`/shop/${product.id}`}
                                onClick={() => setLoadingProductId(product.id)}
                                className="btn btn-primary flex items-center gap-2"
                                aria-busy={loadingProductId === product.id}
                            >
                                <ShoppingCart size={16} />
                                {loadingProductId === product.id ? 'Loading...' : 'Buy Now'}
                            </a>
                        </div>
                    </div>
                ))}
            </section>

            <section className="card mt-12">
                <h2 className="section-title !mb-4">Shipping Info</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="mb-2 font-medium">Domestic Shipping</h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Free shipping on orders over $50. Standard shipping takes 3-5 business days.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-2 font-medium">International Shipping</h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            International orders ship within 7-14 business days. Customs fees may apply.
                        </p>
                    </div>
                </div>
            </section>
        </Main>
    );
};

export default Shop;
