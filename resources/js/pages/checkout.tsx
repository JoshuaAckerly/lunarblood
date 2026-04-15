import Input from '@/components/Input';
import { trackFormSubmission, trackPurchase } from '@/hooks/use-google-analytics';
import Main from '@/layouts/main';
import { CreditCard, Lock } from 'lucide-react';
import React, { useState } from 'react';

interface CheckoutProps {
    orderData: {
        productId: string;
        name: string;
        price: string;
        quantity: string;
        size?: string;
        total: string;
    };
}

const Checkout: React.FC<CheckoutProps> = ({ orderData }) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrorMessage('');

        // Get CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        // Simulate payment processing with CSRF validation
        try {
            const response = await fetch('/api/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({
                    ...formData,
                    orderData,
                }),
            });

            if (response.ok) {
                // Track purchase event
                trackPurchase({
                    productId: orderData.productId,
                    name: orderData.name,
                    price: parseFloat(orderData.price),
                    quantity: parseInt(orderData.quantity),
                    total: parseFloat(orderData.total),
                    transactionId: `order-${Date.now()}`,
                    email: formData.email,
                });

                // Track form submission
                trackFormSubmission('checkout_form');

                setTimeout(() => {
                    window.location.href = '/order-success';
                }, 1000);
            } else if (response.status === 429) {
                setErrorMessage('Too many payment attempts. Please wait a moment and try again.');
                setIsProcessing(false);
                return;
            } else {
                throw new Error('Payment failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setErrorMessage('Payment failed. Please check your details and try again.');
            setIsProcessing(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Main>
            <section className="mx-auto max-w-4xl px-4">
                <h1 className="page-title !mb-6 !text-2xl md:!mb-8 md:!text-3xl">Checkout</h1>

                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errorMessage && (
                                <div className="rounded-md border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--foreground)]">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="card">
                                <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
                                <div className="space-y-4">
                                    <Input
                                        id="email"
                                        label="Email address"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="card">
                                <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            id="firstName"
                                            label="First name"
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Input
                                            id="lastName"
                                            label="Last name"
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <Input
                                        id="address"
                                        label="Address"
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input
                                            id="city"
                                            label="City"
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Input
                                            id="state"
                                            label="State"
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Input
                                            id="zip"
                                            label="ZIP"
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                                    <CreditCard size={20} />
                                    Payment Information
                                </h2>
                                <div className="space-y-4">
                                    <Input
                                        id="cardNumber"
                                        label="Card number"
                                        type="text"
                                        name="cardNumber"
                                        placeholder="4242 4242 4242 4242"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            id="expiry"
                                            label="Expiry date"
                                            type="text"
                                            name="expiry"
                                            placeholder="MM/YY"
                                            value={formData.expiry}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Input
                                            id="cvv"
                                            label="CVV"
                                            type="text"
                                            name="cvv"
                                            placeholder="123"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isProcessing} className="btn btn-primary flex w-full items-center justify-center gap-2">
                                <Lock size={16} />
                                {isProcessing ? 'Processing...' : `Complete Purchase - $${orderData.total}`}
                            </button>
                        </form>
                    </div>

                    <div>
                        <div className="card lg:sticky lg:top-8">
                            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>{orderData.name}</span>
                                    <span>${orderData.price}</span>
                                </div>
                                {orderData.size && (
                                    <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                                        <span>Size: {orderData.size}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                                    <span>Quantity: {orderData.quantity}</span>
                                </div>
                                <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <hr className="border-[var(--border)]" />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>${orderData.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Main>
    );
};

export default Checkout;
