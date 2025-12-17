import React from "react";
import Main from "@/layouts/main";
import Seo from "@/components/Seo";
import { ShoppingCart } from "lucide-react";

// Use CDN in production, local images in development
const cdn = import.meta.env.VITE_ASSET_URL || '';
const getImageUrl = (path: string) => cdn ? `${cdn}${path}` : path;

const products = [
    {
        id: 1,
        name: "Lunar Blood T-Shirt",
        price: 25.00,
        category: "Apparel",
        image: getImageUrl('/images/tshirt.jpg'),
        description: "Black cotton tee with band logo"
    },
    {
        id: 2,
        name: "Blood Moon Vinyl",
        price: 35.00,
        category: "Music",
        image: getImageUrl('/images/vinyl.jpg'),
        description: "Limited edition red vinyl LP"
    },
    {
        id: 3,
        name: "Dark Horizons Hoodie",
        price: 45.00,
        category: "Apparel",
        image: getImageUrl('/images/hoodie.jpg'),
        description: "Premium black hoodie with album art"
    },
    {
        id: 4,
        name: "Band Patch Set",
        price: 15.00,
        category: "Accessories",
        image: getImageUrl('/images/patches.jpg'),
        description: "Set of 3 embroidered patches"
    },
    {
        id: 5,
        name: "Shadows & Echoes CD",
        price: 20.00,
        category: "Music",
        image: getImageUrl('/images/cd.jpg'),
        description: "Latest EP in jewel case"
    },
    {
        id: 6,
        name: "Logo Beanie",
        price: 18.00,
        category: "Accessories",
        image: getImageUrl('/images/beanie.jpg'),
        description: "Embroidered logo beanie"
    }
];

const Shop: React.FC = () => (
    <Main>
        <Seo
            title="Shop - Official Merch & Music"
            description="Buy official Lunar Blood merchandise including band t-shirts, hoodies, vinyl records, CDs, patches, and accessories. Support the band with authentic merch."
            keywords="Lunar Blood merch, band merchandise, metal t-shirts, vinyl records, band hoodie, music merchandise, metal accessories"
            ogType="website"
            canonical="https://lunarblood.graveyardjokes.com/shop"
        />
        <section className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Shop</h1>
            <p className="text-[var(--muted-foreground)] mb-8">
                Official Lunar Blood merchandise and music
            </p>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div key={product.id} className="card group hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-[var(--muted)] rounded-lg mb-4 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--muted)] flex items-center justify-center">
                            <span className="text-[var(--muted-foreground)]">Product Image</span>
                        </div>
                    </div>
                    
                    <div className="mb-2">
                        <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">
                            {product.category}
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                        <a 
                            href={`/shop/${product.id}`}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <ShoppingCart size={16} />
                            Buy Now
                        </a>
                    </div>
                </div>
            ))}
        </section>

        <section className="mt-12 card">
            <h2 className="text-2xl font-semibold mb-4">Shipping Info</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-medium mb-2">Domestic Shipping</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Free shipping on orders over $50. Standard shipping takes 3-5 business days.
                    </p>
                </div>
                <div>
                    <h3 className="font-medium mb-2">International Shipping</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        International orders ship within 7-14 business days. Customs fees may apply.
                    </p>
                </div>
            </div>
        </section>
    </Main>
);

export default Shop;