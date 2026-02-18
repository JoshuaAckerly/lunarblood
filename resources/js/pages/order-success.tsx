import React from "react";
import Main from "@/layouts/main";
import { CheckCircle, Download, ArrowRight } from "lucide-react";

const OrderSuccess: React.FC = () => (
    <Main>
        <section className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-8">
                <CheckCircle size={64} className="mx-auto text-[var(--accent)] mb-4" />
                <h1 className="page-title !text-3xl md:!text-3xl">Order Confirmed!</h1>
                <p className="page-subtitle mx-auto">
                    Thank you for your purchase. Your order has been successfully processed.
                </p>
            </div>

            <div className="card text-left mb-8">
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
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
                <p className="text-[var(--muted-foreground)]">
                    A confirmation email has been sent to your email address with tracking information.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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