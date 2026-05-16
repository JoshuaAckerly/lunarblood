<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $customerEmail,
        public readonly string $firstName,
        public readonly string $orderId,
        public readonly string $productName,
        public readonly string $total,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Order Confirmation — {$this->orderId}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.order-confirmation',
        );
    }
}
