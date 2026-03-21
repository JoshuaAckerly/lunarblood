<?php

namespace Tests\Feature;

use App\Models\Show;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardSearchTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    public function test_dashboard_search_requires_authentication(): void
    {
        $response = $this->getJson('/dashboard/search?query=lunar');

        $response->assertStatus(401);
    }

    public function test_dashboard_search_returns_matching_shows_and_venues(): void
    {
        $matchingVenue = Venue::factory()->create([
            'name' => 'Lunar Hall',
            'city' => 'Austin',
            'state' => 'TX',
            'description' => 'Darkwave venue',
        ]);

        $nonMatchingVenue = Venue::factory()->create([
            'name' => 'Solar Arena',
            'city' => 'Dallas',
            'state' => 'TX',
        ]);

        Show::factory()->create([
            'venue_id' => $matchingVenue->id,
            'status' => 'on-sale',
            'description' => 'Lunar showcase set',
            'date' => now()->addDays(7)->format('Y-m-d'),
        ]);

        Show::factory()->create([
            'venue_id' => $nonMatchingVenue->id,
            'status' => 'coming-soon',
            'description' => 'Unrelated event',
            'date' => now()->addDays(14)->format('Y-m-d'),
        ]);

        $response = $this->actingAs($this->user)->getJson('/dashboard/search?query=lunar');

        $response->assertOk();
        $response->assertJsonPath('query', 'lunar');
        $response->assertJsonCount(1, 'results.shows');
        $response->assertJsonCount(1, 'results.venues');
        $response->assertJsonPath('results.venues.0.name', 'Lunar Hall');
    }

    public function test_dashboard_search_returns_empty_results_for_empty_query(): void
    {
        $response = $this->actingAs($this->user)->getJson('/dashboard/search?query=');

        $response->assertOk();
        $response->assertExactJson([
            'query' => '',
            'results' => [
                'shows' => [],
                'venues' => [],
            ],
        ]);
    }

    public function test_dashboard_search_handles_special_character_query(): void
    {
        $response = $this->actingAs($this->user)->getJson('/dashboard/search?query=%40%23%24');

        $response->assertOk();
        $response->assertJsonStructure([
            'query',
            'results' => [
                'shows',
                'venues',
            ],
        ]);
    }

    public function test_dashboard_search_rejects_queries_over_max_length(): void
    {
        $longQuery = str_repeat('a', 101);

        $response = $this->actingAs($this->user)->getJson('/dashboard/search?query='.$longQuery);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['query']);
    }

    public function test_dashboard_search_prioritizes_exact_name_matches(): void
    {
        $exactVenue = Venue::factory()->create([
            'name' => 'Lunar',
            'city' => 'Austin',
            'state' => 'TX',
        ]);

        $partialVenue = Venue::factory()->create([
            'name' => 'Lunar Hall',
            'city' => 'Austin',
            'state' => 'TX',
        ]);

        Show::factory()->create([
            'venue_id' => $partialVenue->id,
            'status' => 'on-sale',
            'description' => 'Partial venue match show',
            'date' => now()->addDays(7)->format('Y-m-d'),
        ]);

        Show::factory()->create([
            'venue_id' => $exactVenue->id,
            'status' => 'on-sale',
            'description' => 'Exact venue match show',
            'date' => now()->addDays(8)->format('Y-m-d'),
        ]);

        $response = $this->actingAs($this->user)->getJson('/dashboard/search?query=lunar');

        $response->assertOk();
        $response->assertJsonPath('results.venues.0.name', 'Lunar');
        $response->assertJsonPath('results.shows.0.venue_name', 'Lunar');
    }

    public function test_dashboard_search_supports_practical_synonym_queries(): void
    {
        $venue = Venue::factory()->create([
            'name' => 'Moonlight Hall',
            'city' => 'Austin',
            'state' => 'TX',
            'description' => 'Live concert room',
        ]);

        Show::factory()->create([
            'venue_id' => $venue->id,
            'status' => 'on-sale',
            'description' => 'Ambient show with modular set',
            'date' => now()->addDays(4)->format('Y-m-d'),
        ]);

        $response = $this->actingAs($this->user)->getJson('/dashboard/search?query=gig');

        $response->assertOk();
        $response->assertJsonCount(1, 'results.shows');
        $response->assertJsonCount(1, 'results.venues');
        $response->assertJsonPath('results.shows.0.venue_name', 'Moonlight Hall');
        $response->assertJsonPath('results.venues.0.name', 'Moonlight Hall');
    }

    public function test_dashboard_search_handles_sold_out_phrase_without_hyphen(): void
    {
        $venue = Venue::factory()->create([
            'name' => 'Signal Room',
            'city' => 'Austin',
            'state' => 'TX',
        ]);

        Show::factory()->create([
            'venue_id' => $venue->id,
            'status' => 'sold-out',
            'description' => 'Sold out headline set',
            'date' => now()->addDays(3)->format('Y-m-d'),
        ]);

        $response = $this->actingAs($this->user)->getJson('/dashboard/search?query=sold out');

        $response->assertOk();
        $response->assertJsonCount(1, 'results.shows');
        $response->assertJsonPath('results.shows.0.status', 'sold-out');
    }

    public function test_dashboard_search_prioritizes_upcoming_matches_over_past_matches(): void
    {
        $venue = Venue::factory()->create([
            'name' => 'Orbit Hall',
            'city' => 'Austin',
            'state' => 'TX',
        ]);

        $pastShow = Show::factory()->create([
            'venue_id' => $venue->id,
            'status' => 'on-sale',
            'description' => 'Orbit throwback event',
            'date' => now()->subDays(1)->format('Y-m-d'),
        ]);

        $upcomingShow = Show::factory()->create([
            'venue_id' => $venue->id,
            'status' => 'on-sale',
            'description' => 'Orbit future event',
            'date' => now()->addDays(5)->format('Y-m-d'),
        ]);

        $response = $this->actingAs($this->user)->getJson('/dashboard/search?query=orbit');

        $response->assertOk();
        $response->assertJsonCount(2, 'results.shows');
        $response->assertJsonPath('results.shows.0.id', $upcomingShow->id);
        $response->assertJsonPath('results.shows.1.id', $pastShow->id);
    }

    public function test_dashboard_search_preserves_recent_queries_in_session(): void
    {
        Venue::factory()->create([
            'name' => 'Echo Hall',
            'city' => 'Austin',
            'state' => 'TX',
        ]);

        $response = $this->actingAs($this->user)->getJson('/dashboard/search?query=echo');

        $response->assertOk();
        $response->assertSessionHas('dashboard_recent_searches', ['echo']);
    }

    public function test_dashboard_search_deduplicates_recent_queries_case_insensitively(): void
    {
        Venue::factory()->create([
            'name' => 'Echo Hall',
            'city' => 'Austin',
            'state' => 'TX',
        ]);

        $this->actingAs($this->user)->getJson('/dashboard/search?query=Echo');
        $response = $this->actingAs($this->user)->getJson('/dashboard/search?query=echo');

        $response->assertOk();
        $response->assertSessionHas('dashboard_recent_searches', ['echo']);
    }
}
