import React, { useState } from "react";
import Main from "@/layouts/main";
import { CreditCard, Lock } from "lucide-react";

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
        cvv: ''
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
                    orderData
                })
            });
            
            if (response.ok) {
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
            [e.target.name]: e.target.value
        });
    };

    return (
        <Main>
            <section className="max-w-4xl mx-auto px-4">
                <h1 className="page-title !text-2xl md:!text-3xl !mb-6 md:!mb-8">Checkout</h1>
                
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errorMessage && (
                                <div className="rounded-md border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--foreground)]">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="card">
                                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="card">
                                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last name"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        required
                                    />
                                    <div className="grid grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="zip"
                                            placeholder="ZIP"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <CreditCard size={20} />
                                    Payment Information
                                </h2>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="Card number (4242 4242 4242 4242)"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="expiry"
                                            placeholder="MM/YY"
                                            value={formData.expiry}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="cvv"
                                            placeholder="CVV"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="btn btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <Lock size={16} />
                                {isProcessing ? 'Processing...' : `Complete Purchase - $${orderData.total}`}
                            </button>
                        </form>
                    </div>

                    <div>
                        <div className="card lg:sticky lg:top-8">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
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
                                <div className="flex justify-between font-semibold text-lg">
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