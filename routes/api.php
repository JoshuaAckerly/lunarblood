<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Payment processing with strict rate limiting (5 attempts per minute)
Route::middleware(['web', 'throttle:5,1'])->group(function () {
    Route::post('/process-payment', function (Request $request) {
        $request->validate([
            'email' => 'required|email',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:10',
            'cardNumber' => 'required|string',
            'expiry' => 'required|string',
            'cvv' => 'required|string',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment processed successfully',
            'order_id' => 'LB-' . strtoupper(substr(md5(time()), 0, 9))
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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string|max:1000'
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully'
        ]);
    });
});