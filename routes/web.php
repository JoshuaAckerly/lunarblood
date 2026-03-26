<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ShowController;
use App\Http\Controllers\VenueController;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::redirect('/welcome', '/', 301);

Route::get('/listen', function () {
    return Inertia::render('listen');
})->name('listen');

Route::get('/venues', [VenueController::class, 'index'])->name('venues.index');
Route::get('/venues/create', [VenueController::class, 'create'])->name('venues.create');
Route::post('/venues', [VenueController::class, 'store'])->name('venues.store');
Route::get('/venues/{venue}', [VenueController::class, 'show'])->name('venues.show');
Route::get('/venues/{venue}/edit', [VenueController::class, 'edit'])->name('venues.edit');
Route::put('/venues/{venue}', [VenueController::class, 'update'])->name('venues.update');
Route::delete('/venues/{venue}', [VenueController::class, 'destroy'])->name('venues.destroy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/shows', [ShowController::class, 'index'])->name('shows.index');
    Route::get('/shows/create', [ShowController::class, 'create'])->name('shows.create');
    Route::post('/shows', [ShowController::class, 'store'])->name('shows.store');
    Route::get('/shows/{show}', [ShowController::class, 'show'])->name('shows.show');
    Route::get('/shows/{show}/edit', [ShowController::class, 'edit'])->name('shows.edit');
    Route::put('/shows/{show}', [ShowController::class, 'update'])->name('shows.update');
    Route::delete('/shows/{show}', [ShowController::class, 'destroy'])->name('shows.destroy');
});

Route::get('/tour', function () {
    return Inertia::render('tour');
})->name('tour');

Route::get('/shop', function () {
    return Inertia::render('shop');
})->name('shop');

Route::get('/shop/{id}', function ($id) {
    $product = Product::find((int) $id);

    if (! $product) {
        abort(404);
    }

    return Inertia::render('product', [
        'product' => [
            'id' => $product->id,
            'name' => $product->name,
            'price' => (float) $product->price,
            'category' => $product->category,
            'description' => $product->description,
            'details' => $product->description,
            'sizes' => $product->sizes,
        ],
    ]);
})->whereNumber('id')->name('product.show');

Route::get('/checkout', function () {
    $orderData = [
        'productId' => request('productId', '1'),
        'name' => request('name', 'Lunar Blood T-Shirt'),
        'price' => request('price', '25.00'),
        'quantity' => request('quantity', '1'),
        'size' => request('size', ''),
        'total' => request('total', '25.00'),
    ];

    return Inertia::render('checkout', ['orderData' => $orderData]);
})->name('checkout');

Route::get('/order-success', function () {
    return Inertia::render('order-success');
})->name('order.success');

// Test error pages
Route::get('/test-404', function () {
    return Inertia::render('errors/404');
});

Route::get('/test-500', function () {
    return Inertia::render('errors/500');
});

Route::get('/test-403', function () {
    return Inertia::render('errors/403');
});

// Dynamic sitemap
Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/data', [DashboardController::class, 'data'])->name('dashboard.data');
    Route::get('dashboard/search', [DashboardController::class, 'search'])->name('dashboard.search');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
