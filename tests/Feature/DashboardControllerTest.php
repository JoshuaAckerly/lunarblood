<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Show;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    public function test_dashboard_routes_require_authentication(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
        $this->getJson('/dashboard/data')->assertStatus(401);
    }

    public function test_dashboard_page_uses_expected_payload_shape_for_production_data(): void
    {
        $venue = Venue::factory()->create([
            'name' => 'Midnight Theater',
            'city' => 'Austin',
            'state' => null,
        ]);

        Show::factory()->create([
            'venue_id' => $venue->id,
            'date' => now()->addDays(3)->format('Y-m-d'),
            'status' => 'on-sale',
            'price' => null,
            'description' => null,
        ]);

        Product::query()->create([
            'name' => 'Tour Tee',
            'description' => 'Limited run black tee',
            'price' => 25.00,
            'category' => 'apparel',
            'sizes' => ['S', 'M', 'L'],
            'image' => null,
            'stock' => 3,
            'active' => true,
        ]);

        Product::query()->create([
            'name' => 'Archive Poster',
            'description' => 'Collector print',
            'price' => 15.00,
            'category' => 'accessories',
            'sizes' => null,
            'image' => null,
            'stock' => 1,
            'active' => false,
        ]);

        $response = $this->actingAs($this->user)->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('initialError', null)
            ->where('dashboard.stats.venues', 1)
            ->where('dashboard.stats.shows_total', 1)
            ->where('dashboard.stats.shows_upcoming', 1)
            ->where('dashboard.stats.products_active', 1)
            ->where('dashboard.stats.products_low_stock', 1)
            ->has('dashboard.upcoming_shows', 1)
            ->where('dashboard.upcoming_shows.0.venue.name', 'Midnight Theater')
            ->where('dashboard.upcoming_shows.0.venue.state', null)
            ->where('dashboard.upcoming_shows.0.price', null)
            ->has('dashboard.low_stock_products', 1)
            ->where('dashboard.low_stock_products.0.name', 'Tour Tee')
            ->where('dashboard.generated_at', fn ($value) => is_string($value) && $value !== '')
        );
    }

    public function test_dashboard_data_endpoint_returns_expected_empty_shape_with_no_records(): void
    {
        $response = $this->actingAs($this->user)->getJson('/dashboard/data');

        $response->assertOk();
        $response->assertJsonStructure([
            'dashboard' => [
                'stats' => ['venues', 'shows_total', 'shows_upcoming', 'products_active', 'products_low_stock'],
                'upcoming_shows',
                'low_stock_products',
                'generated_at',
            ],
        ]);

        $response->assertJsonPath('dashboard.stats.venues', 0);
        $response->assertJsonPath('dashboard.stats.shows_total', 0);
        $response->assertJsonPath('dashboard.stats.shows_upcoming', 0);
        $response->assertJsonPath('dashboard.stats.products_active', 0);
        $response->assertJsonPath('dashboard.stats.products_low_stock', 0);
        $response->assertJsonCount(0, 'dashboard.upcoming_shows');
        $response->assertJsonCount(0, 'dashboard.low_stock_products');
    }

    public function test_dashboard_and_quick_action_routes_pass_smoke_checks(): void
    {
        $this->actingAs($this->user);

        foreach (['/dashboard', '/shows/create', '/venues', '/shop'] as $path) {
            $this->get($path)->assertOk();
        }
    }
}
