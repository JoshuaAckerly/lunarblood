<?php

namespace App\Services;

use App\Models\Show;
use App\Models\Venue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class SearchService
{
    /**
     * Run scored autocomplete search for shows and venues.
     *
     * @return array{shows: array<int, mixed>, venues: array<int, mixed>}
     */
    public function autocomplete(string $query): array
    {
        $normalizedQuery = mb_strtolower($query);
        $exact = $normalizedQuery;
        $prefix = $normalizedQuery.'%';
        $contains = '%'.$normalizedQuery.'%';
        $containsTerms = $this->buildContainsTerms($normalizedQuery);

        return [
            'shows' => $this->scoredShowSearch($exact, $prefix, $contains, $containsTerms),
            'venues' => $this->scoredVenueSearch($exact, $prefix, $contains, $containsTerms),
        ];
    }

    /**
     * @param  array<int, string>  $containsTerms
     * @return array<int, mixed>
     */
    private function scoredShowSearch(string $exact, string $prefix, string $contains, array $containsTerms): array
    {
        return Show::query()
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
                '(
                    CASE WHEN LOWER(venues.name) = ? THEN 500 ELSE 0 END +
                    CASE WHEN LOWER(venues.name) LIKE ? THEN 300 ELSE 0 END +
                    CASE WHEN LOWER(venues.name) LIKE ? THEN 180 ELSE 0 END +
                    CASE WHEN LOWER(venues.city) = ? THEN 140 ELSE 0 END +
                    CASE WHEN LOWER(venues.city) LIKE ? THEN 90 ELSE 0 END +
                    CASE WHEN LOWER(venues.state) = ? THEN 120 ELSE 0 END +
                    CASE WHEN LOWER(shows.status) = ? THEN 110 ELSE 0 END +
                    CASE WHEN LOWER(shows.status) LIKE ? THEN 70 ELSE 0 END +
                    CASE WHEN LOWER(shows.description) LIKE ? THEN 40 ELSE 0 END
                ) as search_score',
                [$exact, $prefix, $contains, $exact, $contains, $exact, $exact, $contains, $contains]
            )
            ->orderByDesc('search_score')
            ->orderByRaw('CASE WHEN shows.date >= ? THEN 0 ELSE 1 END', [now()->toDateString()])
            ->orderBy('shows.date')
            ->take(5)
            ->get()
            // @phpstan-ignore argument.type, argument.unresolvableType, method.unresolvableReturnType
            ->map(function (Model $show): array {
                return [
                    'id' => $show->id, // @phpstan-ignore-line
                    'date' => optional($show->date)->format('Y-m-d'), // @phpstan-ignore-line
                    'status' => $show->status, // @phpstan-ignore-line
                    'venue_name' => $show->venue_name, // @phpstan-ignore-line
                    'venue_location' => ($show->venue_city && $show->venue_state) // @phpstan-ignore-line
                        ? $show->venue_city.', '.$show->venue_state // @phpstan-ignore-line
                        : null,
                ];
            })
            ->values() // @phpstan-ignore-line
            ->all(); // @phpstan-ignore-line
    }

    /**
     * @param  array<int, string>  $containsTerms
     * @return array<int, mixed>
     */
    private function scoredVenueSearch(string $exact, string $prefix, string $contains, array $containsTerms): array
    {
        return Venue::query()
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
                '(
                    CASE WHEN LOWER(name) = ? THEN 500 ELSE 0 END +
                    CASE WHEN LOWER(name) LIKE ? THEN 320 ELSE 0 END +
                    CASE WHEN LOWER(name) LIKE ? THEN 180 ELSE 0 END +
                    CASE WHEN LOWER(city) = ? THEN 140 ELSE 0 END +
                    CASE WHEN LOWER(city) LIKE ? THEN 90 ELSE 0 END +
                    CASE WHEN LOWER(state) = ? THEN 120 ELSE 0 END +
                    CASE WHEN LOWER(description) LIKE ? THEN 40 ELSE 0 END
                ) as search_score',
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
    }

    /**
     * Expand a search query into scored LIKE terms using synonyms.
     *
     * @return array<int, string>
     */
    public function buildContainsTerms(string $normalizedQuery): array
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
            'on sale' => ['on-sale', 'presale'],
            'onsale' => ['on-sale', 'presale'],
            'presale' => ['pre-sale', 'on-sale'],
            'sold out' => ['sold-out'],
            'soldout' => ['sold-out'],
            'sold-out' => ['sold out'],
            'nyc' => ['new york', 'new york city'],
            'ny' => ['new york', 'new york city', 'nyc'],
            'la' => ['los angeles'],
            'sf' => ['san francisco'],
            'vegas' => ['las vegas'],
            'atx' => ['austin'],
            'phx' => ['phoenix'],
            'nola' => ['new orleans'],
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

    /**
     * @return array<int, string>
     */
    public function getRecentSearches(Request $request): array
    {
        $stored = $request->session()->get('dashboard_recent_searches', []);

        if (! is_array($stored)) {
            return [];
        }

        return array_values(array_filter(
            array_slice($stored, 0, 5),
            static fn ($item): bool => is_string($item) && trim($item) !== ''
        ));
    }

    public function rememberSearch(Request $request, string $query): void
    {
        $trimmed = trim($query);

        if ($trimmed === '') {
            return;
        }

        $recent = $this->getRecentSearches($request);
        $recent = array_values(array_filter(
            $recent,
            static fn (string $item): bool => mb_strtolower($item) !== mb_strtolower($trimmed)
        ));

        array_unshift($recent, $trimmed);
        $request->session()->put('dashboard_recent_searches', array_slice($recent, 0, 5));
    }
}
