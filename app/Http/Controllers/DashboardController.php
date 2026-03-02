<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Show;
use App\Models\Venue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
                'dashboard' => $this->emptyDashboardData(),
                'message' => 'Unable to refresh dashboard data right now.',
            ], 500);
        }
    }

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => ['nullable', 'string', 'max:100'],
        ]);

        $query = trim((string) ($validated['query'] ?? ''));

        if ($query === '') {
            return response()->json([
                'query' => '',
                'results' => [
                    'shows' => [],
                    'venues' => [],
                ],
            ]);
        }

        $normalizedQuery = mb_strtolower($query);
        $exact = $normalizedQuery;
        $prefix = $normalizedQuery.'%';
        $contains = '%'.$normalizedQuery.'%';
        $containsTerms = $this->buildContainsTerms($normalizedQuery);

        $shows = Show::query()
            ->leftJoin('venues', 'shows.venue_id', '=', 'venues.id')
            ->where(function ($builder) use ($containsTerms) {
                foreach ($containsTerms as $termContains) {
                    $builder
                        ->orWhereRaw('LOWER(shows.description) like ?', [$termContains])
                        ->orWhereRaw('LOWER(shows.status) like ?', [$termContains])
                        ->orWhereRaw('LOWER(venues.name) like ?', [$termContains])
                        ->orWhereRaw('LOWER(venues.city) like ?', [$termContains])
                        ->orWhereRaw('LOWER(venues.state) like ?', [$termContains]);
                }
            })
            ->select([
                'shows.id',
                'shows.date',
                'shows.status',
                'venues.name as venue_name',
                'venues.city as venue_city',
                'venues.state as venue_state',
            ])
            ->selectRaw(
                "(
                    CASE WHEN LOWER(venues.name) = ? THEN 500 ELSE 0 END +
                    CASE WHEN LOWER(venues.name) LIKE ? THEN 300 ELSE 0 END +
                    CASE WHEN LOWER(venues.name) LIKE ? THEN 180 ELSE 0 END +
                    CASE WHEN LOWER(venues.city) = ? THEN 140 ELSE 0 END +
                    CASE WHEN LOWER(venues.city) LIKE ? THEN 90 ELSE 0 END +
                    CASE WHEN LOWER(venues.state) = ? THEN 120 ELSE 0 END +
                    CASE WHEN LOWER(shows.status) = ? THEN 80 ELSE 0 END +
                    CASE WHEN LOWER(shows.description) LIKE ? THEN 40 ELSE 0 END
                ) as search_score",
                [$exact, $prefix, $contains, $exact, $contains, $exact, $exact, $contains]
            )
            ->orderByDesc('search_score')
            ->orderByDesc('date')
            ->take(5)
            ->get()
            ->map(function ($show): array {
                return [
                    'id' => $show->id,
                    'date' => optional($show->date)->format('Y-m-d'),
                    'status' => $show->status,
                    'venue_name' => $show->venue_name,
                    'venue_location' => $show->venue_city && $show->venue_state
                        ? $show->venue_city.', '.$show->venue_state
                        : null,
                ];
            })
            ->values()
            ->all();

        $venues = Venue::query()
            ->where(function ($builder) use ($containsTerms) {
                foreach ($containsTerms as $termContains) {
                    $builder
                        ->orWhereRaw('LOWER(name) like ?', [$termContains])
                        ->orWhereRaw('LOWER(city) like ?', [$termContains])
                        ->orWhereRaw('LOWER(state) like ?', [$termContains])
                        ->orWhereRaw('LOWER(description) like ?', [$termContains]);
                }
            })
            ->select(['id', 'name', 'city', 'state'])
            ->selectRaw(
                "(
                    CASE WHEN LOWER(name) = ? THEN 500 ELSE 0 END +
                    CASE WHEN LOWER(name) LIKE ? THEN 320 ELSE 0 END +
                    CASE WHEN LOWER(name) LIKE ? THEN 180 ELSE 0 END +
                    CASE WHEN LOWER(city) = ? THEN 140 ELSE 0 END +
                    CASE WHEN LOWER(city) LIKE ? THEN 90 ELSE 0 END +
                    CASE WHEN LOWER(state) = ? THEN 120 ELSE 0 END +
                    CASE WHEN LOWER(description) LIKE ? THEN 40 ELSE 0 END
                ) as search_score",
                [$exact, $prefix, $contains, $exact, $contains, $exact, $contains]
            )
            ->orderByDesc('search_score')
            ->orderBy('name')
            ->take(5)
            ->get()
            ->map(function (Venue $venue): array {
                return [
                    'id' => $venue->id,
                    'name' => $venue->name,
                    'location' => $venue->city && $venue->state
                        ? $venue->city.', '.$venue->state
                        : null,
                ];
            })
            ->values()
            ->all();

        return response()->json([
            'query' => $query,
            'results' => [
                'shows' => $shows,
                'venues' => $venues,
            ],
        ]);
    }

    /**
     * @return array<int, string>
     */
    private function buildContainsTerms(string $normalizedQuery): array
    {
        $synonyms = [
            'gig' => ['show', 'concert', 'live'],
            'gigs' => ['shows', 'concerts', 'live'],
            'concert' => ['show', 'gig', 'live'],
            'concerts' => ['shows', 'gigs', 'live'],
            'show' => ['gig', 'concert', 'live'],
            'shows' => ['gigs', 'concerts', 'live'],
            'tickets' => ['on-sale', 'presale', 'sold-out'],
            'ticket' => ['on-sale', 'presale', 'sold-out'],
            'nyc' => ['new york', 'new york city'],
            'la' => ['los angeles'],
        ];

        $terms = [$normalizedQuery];
        $tokens = preg_split('/\s+/', $normalizedQuery, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        foreach ($tokens as $token) {
            $terms[] = $token;

            if (array_key_exists($token, $synonyms)) {
                $terms = array_merge($terms, $synonyms[$token]);
            }
        }

        if (array_key_exists($normalizedQuery, $synonyms)) {
            $terms = array_merge($terms, $synonyms[$normalizedQuery]);
        }

        $uniqueTerms = array_values(array_unique(array_filter(array_map('trim', $terms), static fn (string $term): bool => $term !== '')));

        return array_map(static fn (string $term): string => '%'.$term.'%', $uniqueTerms);
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
