<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function validPaymentData(string $idempotencyKey = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN'): array
    {
        return [
            'email' => 'test@example.com',
            'firstName' => 'John',
            'lastName' => 'Doe',
            'address' => '123 Test St',
            'city' => 'Seattle',
            'state' => 'WA',
            'zip' => '98101',
            'cardNumber' => '4242424242424242',
            'expiry' => '12/25',
            'cvv' => '123',
            'idempotency_key' => $idempotencyKey,
            'orderData' => [
                'productId' => '1',
                'name' => 'Lunar Blood T-Shirt',
                'price' => '25.00',
                'quantity' => '1',
                'total' => '25.00',
            ],
        ];
    }

    public function test_health_endpoint_returns_success(): void
    {
        $response = $this->get('/api/health');

        $response->assertStatus(200)
            ->assertJson(['status' => 'ok']);
    }

    public function test_payment_processing_requires_validation(): void
    {
        $response = $this->postJson('/api/process-payment', $this->validPaymentData());

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_payment_processing_with_valid_data(): void
    {
        $response = $this->postJson('/api/process-payment', $this->validPaymentData('bcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNO'));

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_payment_rejects_empty_order_data(): void
    {
        $response = $this->postJson('/api/process-payment', array_merge($this->validPaymentData(), [
            'orderData' => [],
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'orderData.productId',
                'orderData.name',
                'orderData.price',
                'orderData.quantity',
                'orderData.total',
            ]);
    }

    public function test_payment_rejects_duplicate_submission(): void
    {
        $paymentData = $this->validPaymentData('cdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP');

        $this->postJson('/api/process-payment', $paymentData)->assertStatus(200);

        $response = $this->postJson('/api/process-payment', $paymentData);

        $response->assertStatus(409)
            ->assertJson([
                'success' => false,
                'message' => 'Payment request already processed',
            ]);
    }

    public function test_contact_form_rate_limiting(): void
    {
        $contactData = [
            'name' => 'John Doe',
            'email' => 'test@example.com',
            'message' => 'Test message',
        ];

        // Make 4 requests (limit is 3 per minute)
        for ($i = 0; $i < 4; $i++) {
            $response = $this->postJson('/api/contact', $contactData);

            if ($i < 3) {
                $response->assertStatus(200);
            } else {
                $response->assertStatus(429); // Too Many Requests
            }
        }
    }

    public function test_payment_validation_errors(): void
    {
        $invalidData = [
            'email' => 'invalid-email',
            'firstName' => '',
        ];

        $response = $this->postJson('/api/process-payment', $invalidData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'firstName']);
    }
}
