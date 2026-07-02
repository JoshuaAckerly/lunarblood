<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmationMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    public function process(Request $request): JsonResponse
    {
        /** @var array{email: string, firstName: string, lastName: string, address: string, city: string, state: string, zip: string, cardNumber: string, expiry: string, cvv: string} $validated */
        $validated = $request->validate([
            'email' => 'required|email',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:10',
            'cardNumber' => 'required|string|min:12|max:25',
            'expiry' => ['required', 'regex:/^(0[1-9]|1[0-2])\\/[0-9]{2}$/'],
            'cvv' => ['required', 'regex:/^[0-9]{3,4}$/'],
        ]);

        $email = strtolower(trim((string) $validated['email']));
        $firstName = trim(strip_tags((string) $validated['firstName']));
        $lastName = trim(strip_tags((string) $validated['lastName']));
        $address = trim(strip_tags((string) $validated['address']));
        $city = trim(strip_tags((string) $validated['city']));
        $state = strtoupper(trim(strip_tags((string) $validated['state'])));
        $zip = strtoupper(preg_replace('/[^A-Za-z0-9- ]/', '', (string) $validated['zip']) ?? '');
        $cardNumber = preg_replace('/\D/', '', (string) $validated['cardNumber']) ?? '';
        $expiry = trim((string) $validated['expiry']);
        $cvv = preg_replace('/\D/', '', (string) $validated['cvv']) ?? '';

        if (strlen($cardNumber) < 12 || strlen($cardNumber) > 19) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payment data provided',
            ], 422);
        }

        $orderId = 'LB-'.strtoupper(substr(md5($email.now()->timestamp), 0, 9));

        $productName = $request->input('orderData.name', 'Your Order');
        $total = $request->input('orderData.total', '0.00');

        Mail::to($email)->send(new OrderConfirmationMail(
            customerEmail: $email,
            firstName: $firstName,
            orderId: $orderId,
            productName: is_string($productName) ? $productName : 'Your Order',
            total: is_string($total) ? $total : '0.00',
        ));

        return response()->json([
            'success' => true,
            'message' => 'Payment processed successfully',
            'order_id' => $orderId,
        ]);
    }
}
