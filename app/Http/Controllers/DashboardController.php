<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Show;
use App\Models\Venue;
use App\Services\SearchService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DashboardController extends Controller
{
    public function __construct(private readonly SearchService $search) {}

    public function index(Request $request): Response
    {
        $recentSearches = $this->search->getRecentSearches($request);

        try {
            return Inertia::render('dashboard', [
                'dashboard' => $this->getDashboardData(),
                'initialError' => null,
                'recentSearches' => $recentSearches,
            ]);
        } catch (Throwable $exception) {
            Log::error('Dashboard data failed to load.', [
                'message' => $exception->getMessage(),
            ]);

            return Inertia::render('dashboard', [
                'dashboard' => $this->emptyDashboardData(),
                'initialError' => 'Dashboard data is temporarily unavailable. Please refresh in a moment.',
                'recentSearches' => $recentSearches,
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
                'dashboard' => $this->emptyDashboardData(),
                'message' => 'Unable to refresh dashboard data right now.',
            ], 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        /** @var array<string, mixed> $validated */
        $validated = $request->validate([
            'query' => ['nullable', 'string', 'max:100'],
        ]);

        $queryVal = $validated['query'] ?? '';
        $query = trim(is_string($queryVal) ? $queryVal : '');

        if ($query === '') {
            return response()->json([
                'query' => '',
                'results' => [
                    'shows' => [],
                    'venues' => [],
                ],
            ]);
        }

        $results = $this->search->autocomplete($query);
        $this->search->rememberSearch($request, $query);

        return response()->json([
            'query' => $query,
            'results' => $results,
        ]);
    }

    public static function clearCache(): void
    {
        Cache::forget('dashboard.data');
    }

    /** @return array<string, mixed> */
    private function getDashboardData(): array
    {
        /** @var array<string, mixed> */
        return Cache::remember('dashboard.data', 300, function (): array {
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
                    /** @var Carbon|null $showDate */
                    $showDate = $show->date;

                    return [
                        'id' => $show->id,
                        'date' => $showDate?->format('Y-m-d'),
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
        });
    }

    /** @return array<string, mixed> */
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
