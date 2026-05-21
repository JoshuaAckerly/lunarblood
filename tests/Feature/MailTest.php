<?php

namespace Tests\Feature;

use App\Mail\ContactFormMail;
use App\Mail\OrderConfirmationMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MailTest extends TestCase
{
    use RefreshDatabase;

    /** @var array<string, mixed> */
    private array $validPaymentData = [
        'email' => 'customer@example.com',
        'firstName' => 'Jane',
        'lastName' => 'Doe',
        'address' => '123 Test St',
        'city' => 'Buffalo',
        'state' => 'NY',
        'zip' => '14201',
        'cardNumber' => '4242424242424242',
        'expiry' => '12/25',
        'cvv' => '123',
        'orderData' => [
            'name' => 'Lunar Blood T-Shirt',
            'total' => '25.00',
        ],
    ];

    public function test_order_confirmation_mail_dispatched_on_successful_payment(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/process-payment', $this->validPaymentData);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        Mail::assertSent(OrderConfirmationMail::class, function (OrderConfirmationMail $mail) {
            return $mail->customerEmail === 'customer@example.com'
                && $mail->firstName === 'Jane'
                && $mail->productName === 'Lunar Blood T-Shirt'
                && $mail->total === '25.00';
        });
    }

    public function test_order_confirmation_mail_not_sent_on_invalid_payment(): void
    {
        Mail::fake();

        $this->postJson('/api/process-payment', array_merge($this->validPaymentData, [
            'cardNumber' => 'bad',
        ]));

        Mail::assertNotSent(OrderConfirmationMail::class);
    }

    public function test_contact_form_mail_dispatched_on_valid_submission(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/contact', [
            'name' => 'John Fan',
            'email' => 'fan@example.com',
            'message' => 'Love the music!',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        Mail::assertSent(ContactFormMail::class, function (ContactFormMail $mail) {
            return $mail->senderName === 'John Fan'
                && $mail->senderEmail === 'fan@example.com'
                && $mail->messageBody === 'Love the music!';
        });
    }

    public function test_contact_form_mail_not_sent_on_invalid_submission(): void
    {
        Mail::fake();

        $this->postJson('/api/contact', [
            'name' => '',
            'email' => 'not-an-email',
            'message' => '',
        ]);

        Mail::assertNotSent(ContactFormMail::class);
    }
}
