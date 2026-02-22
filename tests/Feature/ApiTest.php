<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_endpoint_returns_success(): void
    {
        $response = $this->get('/api/health');

        $response->assertStatus(200)
                 ->assertJson(['status' => 'ok']);
    }

    public function test_payment_processing_requires_validation(): void
    {
        $paymentData = [
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
        ];

        $response = $this->postJson('/api/process-payment', $paymentData);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_payment_processing_with_valid_data(): void
    {
        $paymentData = [
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
        ];

        $response = $this->postJson('/api/process-payment', $paymentData);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
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
