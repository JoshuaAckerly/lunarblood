import React, { useState } from "react";
import Main from "@/layouts/main";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";

interface ProductProps {
    product: {
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
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');

    const handlePurchase = () => {
        // Redirect to checkout with product data
        const purchaseData = {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            size: selectedSize,
            total: product.price * quantity
        };
        
        const params = new URLSearchParams(purchaseData as any).toString();
        window.location.href = `/checkout?${params}`;
    };

    return (
        <Main>
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
                        
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
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
                                            className={`px-4 py-2 border rounded-md ${
                                                selectedSize === size 
                                                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' 
                                                    : 'border-[var(--border)]'
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
                                    className="w-10 h-10 rounded-md border border-[var(--border)] flex items-center justify-center"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-md border border-[var(--border)] flex items-center justify-center"
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

                        <button
                            onClick={handlePurchase}
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={20} />
                            Add to Cart & Checkout
                        </button>
                    </div>
                </div>
            </section>
        </Main>
    );
};

export default Product;