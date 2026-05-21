<?php

use App\Http\Controllers\Api\MessageProxyController;
use App\Mail\ContactFormMail;
use App\Mail\OrderConfirmationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

Route::get('/messages', [MessageProxyController::class, 'index']);
Route::patch('/messages/read-all', [MessageProxyController::class, 'markAllRead']);
Route::patch('/messages/{id}/read', [MessageProxyController::class, 'markRead']);

// Payment processing with strict rate limiting (5 attempts per minute)
Route::middleware(['throttle:5,1'])->group(function () {
    Route::post('/process-payment', function (Request $request) {
        $validator = Validator::make($request->all(), [
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

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payment data provided',
                'errors' => $validator->errors(),
            ], 422);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $emailVal = $validated['email'] ?? '';
        $firstNameVal = $validated['firstName'] ?? '';
        $lastNameVal = $validated['lastName'] ?? '';
        $addressVal = $validated['address'] ?? '';
        $cityVal = $validated['city'] ?? '';
        $stateVal = $validated['state'] ?? '';
        $zipVal = $validated['zip'] ?? '';
        $cardNumberVal = $validated['cardNumber'] ?? '';
        $expiryVal = $validated['expiry'] ?? '';
        $cvvVal = $validated['cvv'] ?? '';

        assert(is_string($emailVal) && is_string($firstNameVal) && is_string($lastNameVal));
        assert(is_string($addressVal) && is_string($cityVal) && is_string($stateVal));
        assert(is_string($zipVal) && is_string($cardNumberVal) && is_string($expiryVal) && is_string($cvvVal));

        $sanitized = [
            'email' => strtolower(trim($emailVal)),
            'firstName' => trim(strip_tags($firstNameVal)),
            'lastName' => trim(strip_tags($lastNameVal)),
            'address' => trim(strip_tags($addressVal)),
            'city' => trim(strip_tags($cityVal)),
            'state' => strtoupper(trim(strip_tags($stateVal))),
            'zip' => strtoupper(preg_replace('/[^A-Za-z0-9- ]/', '', $zipVal) ?? ''),
            'cardNumber' => preg_replace('/\D/', '', $cardNumberVal) ?? '',
            'expiry' => trim($expiryVal),
            'cvv' => preg_replace('/\D/', '', $cvvVal) ?? '',
        ];

        if (strlen($sanitized['cardNumber']) < 12 || strlen($sanitized['cardNumber']) > 19) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payment data provided',
            ], 422);
        }

        $orderId = 'LB-'.strtoupper(substr(md5($sanitized['email'].now()->timestamp), 0, 9));

        $productName = $request->input('orderData.name', 'Your Order');
        $total = $request->input('orderData.total', '0.00');
        Mail::to($sanitized['email'])->send(new OrderConfirmationMail(
            customerEmail: $sanitized['email'],
            firstName: $sanitized['firstName'],
            orderId: $orderId,
            productName: is_string($productName) ? $productName : 'Your Order',
            total: is_string($total) ? $total : '0.00',
        ));

        return response()->json([
            'success' => true,
            'message' => 'Payment processed successfully',
            'order_id' => $orderId,
        ]);
    });
});

// General API endpoints with moderate rate limiting (60 per minute)
Route::middleware(['throttle:60,1'])->group(function () {
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'timestamp' => now()]);
    });
});

// Contact form with strict rate limiting (3 per minute)
Route::middleware(['throttle:3,1'])->group(function () {
    Route::post('/contact', function (Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid contact data provided',
                'errors' => $validator->errors(),
            ], 422);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $nameVal = $validated['name'] ?? '';
        $emailVal2 = $validated['email'] ?? '';
        $messageVal = $validated['message'] ?? '';
        assert(is_string($nameVal) && is_string($emailVal2) && is_string($messageVal));

        $sanitized = [
            'name' => trim(strip_tags($nameVal)),
            'email' => strtolower(trim($emailVal2)),
            'message' => trim(strip_tags($messageVal)),
        ];

        if ($sanitized['name'] === '' || $sanitized['message'] === '') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid contact data provided',
            ], 422);
        }

        Mail::to(config('mail.from.address'))->send(new ContactFormMail(
            senderName: $sanitized['name'],
            senderEmail: $sanitized['email'],
            messageBody: $sanitized['message'],
        ));

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
        ]);
    });
});
