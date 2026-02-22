<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::redirect('/welcome', '/', 301);

Route::get('/listen', function () {
    return Inertia::render('listen');
})->name('listen');

Route::get('/venues', function () {
    return Inertia::render('venues');
})->name('venues');

Route::get('/venues/{id}', function ($id) {
    $venues = [
        1 => [
            'id' => 1,
            'name' => 'The Underground',
            'city' => 'Seattle, WA',
            'address' => '123 Dark Street, Seattle, WA 98101',
            'capacity' => 500,
            'description' => 'An intimate underground venue known for its incredible acoustics and dark atmosphere. Perfect for heavy, atmospheric music.',
            'website' => 'https://theunderground.com',
            'phone' => '(206) 555-0123',
            'shows' => [
                ['date' => 'March 15, 2024', 'status' => 'On Sale', 'ticketUrl' => '#'],
                ['date' => 'June 8, 2024', 'status' => 'Coming Soon'],
            ],
        ],
        2 => [
            'id' => 2,
            'name' => 'Dark Moon Club',
            'city' => 'Portland, OR',
            'address' => '456 Nocturne Ave, Portland, OR 97205',
            'capacity' => 300,
            'description' => 'A compact club space known for immersive lighting and intimate heavy sets.',
            'website' => 'https://darkmoonclub.com',
            'phone' => '(503) 555-0188',
            'shows' => [
                ['date' => 'April 2, 2024', 'status' => 'On Sale', 'ticketUrl' => '#'],
            ],
        ],
        3 => [
            'id' => 3,
            'name' => 'Crimson Hall',
            'city' => 'San Francisco, CA',
            'address' => '789 Redline Blvd, San Francisco, CA 94103',
            'capacity' => 800,
            'description' => 'Large-format venue with strong low-end acoustics and premium production support.',
            'website' => 'https://crimsonhall.com',
            'phone' => '(415) 555-0107',
            'shows' => [
                ['date' => 'April 20, 2024', 'status' => 'Sold Out'],
            ],
        ],
    ];

    $venueId = (int) $id;
    $venue = $venues[$venueId] ?? null;

    if (! $venue) {
        abort(404);
    }
    
    return Inertia::render('venue-detail', ['venue' => $venue]);
})->whereNumber('id')->name('venue.show');

Route::get('/tour', function () {
    return Inertia::render('tour');
})->name('tour');

Route::get('/shop', function () {
    return Inertia::render('shop');
})->name('shop');

Route::get('/shop/{id}', function ($id) {
    // Mock product data - replace with database query
    $products = [
        1 => [
            'id' => 1,
            'name' => 'Lunar Blood T-Shirt',
            'price' => 25.00,
            'category' => 'Apparel',
            'description' => 'Black cotton tee with band logo',
            'details' => 'Premium 100% cotton t-shirt featuring the iconic Lunar Blood logo. Comfortable fit with reinforced seams for durability.',
            'sizes' => ['S', 'M', 'L', 'XL', 'XXL']
        ],
        2 => [
            'id' => 2,
            'name' => 'Blood Moon Vinyl',
            'price' => 35.00,
            'category' => 'Music',
            'description' => 'Limited edition red vinyl LP',
            'details' => 'Limited edition pressing on translucent red vinyl. Includes digital download code and exclusive liner notes.'
        ]
    ];
    
    $productId = (int) $id;
    $product = $products[$productId] ?? null;

    if (! $product) {
        abort(404);
    }

    return Inertia::render('product', ['product' => $product]);
})->whereNumber('id')->name('product.show');

Route::get('/checkout', function () {
    $orderData = [
        'productId' => request('productId', '1'),
        'name' => request('name', 'Lunar Blood T-Shirt'),
        'price' => request('price', '25.00'),
        'quantity' => request('quantity', '1'),
        'size' => request('size', ''),
        'total' => request('total', '25.00')
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
});

Route::redirect('/login', '/', 301)->name('login');
Route::redirect('/register', '/', 301);
Route::redirect('/reset-password', '/', 301);
Route::redirect('/forgot-password', '/', 301);
Route::redirect('/reset-password/{token}', '/', 301);
Route::redirect('/verify-email', '/', 301);
Route::redirect('/confirm-password', '/', 301);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
