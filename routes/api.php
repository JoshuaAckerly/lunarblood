<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\MessageProxyController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Support\Facades\Route;

Route::get('/messages', [MessageProxyController::class, 'index']);
Route::patch('/messages/read-all', [MessageProxyController::class, 'markAllRead']);
Route::patch('/messages/{id}/read', [MessageProxyController::class, 'markRead']);

// Payment processing with strict rate limiting (5 attempts per minute)
Route::middleware(['throttle:5,1'])->group(function () {
    Route::post('/process-payment', [PaymentController::class, 'process']);
});

// General API endpoints with moderate rate limiting (60 per minute)
Route::middleware(['throttle:60,1'])->group(function () {
    Route::get('/health', fn () => response()->json(['status' => 'ok', 'timestamp' => now()]));
});

// Contact form with strict rate limiting (3 per minute)
Route::middleware(['throttle:3,1'])->group(function () {
    Route::post('/contact', [ContactController::class, 'send']);
});
