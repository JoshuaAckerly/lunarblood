<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Show;
use App\Models\Venue;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DashboardController extends Controller
{
    public function index(): Response
    {
        try {
            return Inertia::render('dashboard', [
                'dashboard' => $this->getDashboardData(),
                'initialError' => null,
            ]);
        } catch (Throwable $exception) {
            Log::error('Dashboard data failed to load.', [
                'message' => $exception->getMessage(),
            ]);

            return Inertia::render('dashboard', [
                'dashboard' => $this->emptyDashboardData(),
                'initialError' => 'Dashboard data is temporarily unavailable. Please refresh in a moment.',
            ]);
        }
    }

    public function data(): JsonResponse
    {
        try {
            return response()->json([
                'dashboard' => $this->getDashboardData(),
            ]);
        } catch (Throwable $exception) {
            Log::error('Dashboard refresh failed.', [
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'Unable to refresh dashboard data right now.',
            ], 500);
        }
    }

    private function getDashboardData(): array
    {
        $upcomingShowsQuery = Show::query()
            ->with(['venue:id,name,city,state'])
            ->whereDate('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->orderBy('time');

        $lowStockProductsQuery = Product::query()
            ->active()
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->orderBy('name');

        $upcomingShows = $upcomingShowsQuery
            ->take(5)
            ->get()
            ->map(function (Show $show): array {
                return [
                    'id' => $show->id,
                    'date' => optional($show->date)->format('Y-m-d'),
                    'time' => $show->time,
                    'status' => $show->status,
                    'price' => $show->price,
                    'venue' => [
                        'name' => $show->venue?->name,
                        'city' => $show->venue?->city,
                        'state' => $show->venue?->state,
                    ],
                ];
            })
            ->values()
            ->all();

        $lowStockProducts = $lowStockProductsQuery
            ->take(5)
            ->get(['id', 'name', 'stock', 'category'])
            ->map(function (Product $product): array {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'stock' => $product->stock,
                    'category' => $product->category,
                ];
            })
            ->values()
            ->all();

        return [
            'stats' => [
                'venues' => Venue::query()->count(),
                'shows_total' => Show::query()->count(),
                'shows_upcoming' => (clone $upcomingShowsQuery)->count(),
                'products_active' => Product::query()->active()->count(),
                'products_low_stock' => (clone $lowStockProductsQuery)->count(),
            ],
            'upcoming_shows' => $upcomingShows,
            'low_stock_products' => $lowStockProducts,
            'generated_at' => now()->toIso8601String(),
        ];
    }

    private function emptyDashboardData(): array
    {
        return [
            'stats' => [
                'venues' => 0,
                'shows_total' => 0,
                'shows_upcoming' => 0,
                'products_active' => 0,
                'products_low_stock' => 0,
            ],
            'upcoming_shows' => [],
            'low_stock_products' => [],
            'generated_at' => now()->toIso8601String(),
        ];
    }
}
