<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

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

        $validated = $validator->validated();

        $sanitized = [
            'email' => strtolower(trim($validated['email'])),
            'firstName' => trim(strip_tags($validated['firstName'])),
            'lastName' => trim(strip_tags($validated['lastName'])),
            'address' => trim(strip_tags($validated['address'])),
            'city' => trim(strip_tags($validated['city'])),
            'state' => strtoupper(trim(strip_tags($validated['state']))),
            'zip' => strtoupper(preg_replace('/[^A-Za-z0-9- ]/', '', $validated['zip']) ?? ''),
            'cardNumber' => preg_replace('/\D/', '', $validated['cardNumber']) ?? '',
            'expiry' => trim($validated['expiry']),
            'cvv' => preg_replace('/\D/', '', $validated['cvv']) ?? '',
        ];

        if (strlen($sanitized['cardNumber']) < 12 || strlen($sanitized['cardNumber']) > 19) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payment data provided',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment processed successfully',
            'order_id' => 'LB-' . strtoupper(substr(md5($sanitized['email'] . now()->timestamp), 0, 9))
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
            'message' => 'required|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid contact data provided',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $sanitized = [
            'name' => trim(strip_tags($validated['name'])),
            'email' => strtolower(trim($validated['email'])),
            'message' => trim(strip_tags($validated['message'])),
        ];

        if ($sanitized['name'] === '' || $sanitized['message'] === '') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid contact data provided',
            ], 422);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully'
        ]);
    });
});