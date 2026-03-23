import Main from '@/layouts/main';
import { ArrowRight, CheckCircle, Download } from 'lucide-react';
import React from 'react';

const OrderSuccess: React.FC = () => (
    <Main>
        <section className="mx-auto max-w-2xl py-12 text-center">
            <div className="mb-8">
                <CheckCircle size={64} className="mx-auto mb-4 text-[var(--accent)]" />
                <h1 className="page-title !text-3xl md:!text-3xl">Order Confirmed!</h1>
                <p className="page-subtitle mx-auto">Thank you for your purchase. Your order has been successfully processed.</p>
            </div>

            <div className="card mb-8 text-left">
                <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Order Number:</span>
                        <span className="font-mono">#LB-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Email:</span>
                        <span>confirmation@lunarblood.com</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span>3-5 business days</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-[var(--muted-foreground)]">A confirmation email has been sent to your email address with tracking information.</p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <button className="btn btn-secondary flex items-center gap-2">
                        <Download size={16} />
                        Download Receipt
                    </button>
                    <a href="/shop" className="btn btn-primary flex items-center gap-2">
                        Continue Shopping
                        <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    </Main>
);

export default OrderSuccess;
