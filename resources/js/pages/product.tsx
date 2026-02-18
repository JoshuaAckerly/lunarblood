import React, { useState } from "react";
import Main from "@/layouts/main";
import Seo from "@/components/Seo";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";

interface ProductProps {
    product?: {
        id: number;
        name: string;
        price: number;
        category: string;
        description: string;
        details: string;
        sizes?: string[];
    };
}

const Product: React.FC<ProductProps> = ({ product }) => {
    if (!product) {
        return (
            <Main>
                <section className="max-w-2xl mx-auto py-10">
                    <div className="card">
                        <h1 className="page-title !text-2xl md:!text-2xl">Product Not Found</h1>
                        <p className="page-subtitle mb-6">The item you requested is unavailable.</p>
                        <a href="/shop" className="btn btn-primary">Back to Shop</a>
                    </div>
                </section>
            </Main>
        );
    }

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');

    const handlePurchase = () => {
        setCheckoutError('');
        setIsRedirecting(true);

        try {
            const purchaseData: Record<string, string> = {
                productId: product.id.toString(),
                name: product.name,
                price: product.price.toString(),
                quantity: quantity.toString(),
                size: selectedSize,
                total: (product.price * quantity).toString(),
            };

            const params = new URLSearchParams(purchaseData).toString();
            window.location.assign(`/checkout?${params}`);
        } catch {
            setCheckoutError('Unable to continue to checkout. Please try again.');
            setIsRedirecting(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.details,
        "category": product.category,
        "brand": {
            "@type": "Brand",
            "name": "Lunar Blood"
        },
        "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": `https://lunarblood.graveyardjokes.com/shop/${product.id}`
        }
    };

    return (
        <Main>
            <Seo
                title={`${product.name} - Shop`}
                description={`Buy ${product.name} for $${product.price.toFixed(2)}. ${product.details}`}
                keywords={`${product.name}, ${product.category}, Lunar Blood merchandise, band merch`}
                ogType="product"
                canonical={`https://lunarblood.graveyardjokes.com/shop/${product.id}`}
                structuredData={structuredData}
            />
            <section className="mb-8">
                <a href="/shop" className="inline-flex items-center gap-2 nav-link mb-6">
                    <ArrowLeft size={16} />
                    Back to Shop
                </a>
                
                <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                        <div className="aspect-square bg-[var(--muted)] rounded-lg overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--muted)] flex items-center justify-center">
                                <span className="text-[var(--muted-foreground)]">Product Image</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div className="mb-4">
                            <span className="text-sm text-[var(--muted-foreground)] uppercase tracking-wide">
                                {product.category}
                            </span>
                        </div>
                        
                        <h1 className="page-title !text-3xl md:!text-3xl !mb-4">{product.name}</h1>
                        <p className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</p>
                        
                        <p className="text-[var(--muted-foreground)] mb-6">{product.details}</p>

                        {product.sizes && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Size</label>
                                <div className="flex gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`btn ${
                                                selectedSize === size 
                                                    ? 'btn-primary' 
                                                    : 'btn-secondary border border-[var(--border)]'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Quantity</label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="btn btn-secondary border border-[var(--border)] !p-0 w-10 h-10"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="btn btn-secondary border border-[var(--border)] !p-0 w-10 h-10"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-lg font-semibold">
                                Total: ${(product.price * quantity).toFixed(2)}
                            </div>
                        </div>

                        {checkoutError && (
                            <div className="mb-4 rounded-md border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--foreground)]">
                                {checkoutError}
                            </div>
                        )}

                        <button
                            onClick={handlePurchase}
                            disabled={isRedirecting}
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={20} />
                            {isRedirecting ? 'Loading checkout...' : 'Add to Cart & Checkout'}
                        </button>
                    </div>
                </div>
            </section>
        </Main>
    );
};

export default Product;