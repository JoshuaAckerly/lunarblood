<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmationMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    public function process(Request $request): JsonResponse
    {
        /** @var array{email: string, firstName: string, lastName: string, address: string, city: string, state: string, zip: string, cardNumber: string, expiry: string, cvv: string, idempotency_key: string, orderData: array{name: string, total: string|int|float}} $validated */
        $validated = $request->validate([
            'email' => 'required|email',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:10',
            'cardNumber' => 'required|string|min:12|max:25',
            'expiry' => ['required', 'regex:/^(0[1-9]|1[0-2])\/[0-9]{2}$/'],
            'cvv' => ['required', 'regex:/^[0-9]{3,4}$/'],
            'idempotency_key' => 'required|string|size:40',
            'orderData' => 'required|array',
            'orderData.productId' => 'required|string|max:50',
            'orderData.name' => 'required|string|max:255',
            'orderData.price' => 'required|numeric|min:0.01',
            'orderData.quantity' => 'required|integer|min:1|max:99',
            'orderData.total' => 'required|numeric|min:0.01',
        ]);

        $idempotencyKey = 'payment.idem.'.$validated['idempotency_key'];

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

        if (! Cache::add($idempotencyKey, true, now()->addMinutes(15))) {
            return response()->json([
                'success' => false,
                'message' => 'Payment request already processed',
            ], 409);
        }

        $orderId = 'LB-'.strtoupper(substr(md5($email.now()->timestamp), 0, 9));

        $productName = $validated['orderData']['name'];
        $total = (string) $validated['orderData']['total'];

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
