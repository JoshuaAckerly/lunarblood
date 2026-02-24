<?php

namespace Tests\Feature;

use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VenueTest extends TestCase
{
    use RefreshDatabase;

    public function test_venues_index_page_loads()
    {
        Venue::factory()->count(3)->create();

        $response = $this->get('/venues');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('venues/index')
            ->has('venues', 3)
        );
    }

    public function test_venue_creation()
    {
        $venueData = [
            'name' => 'Test Venue',
            'city' => 'Test City',
            'state' => 'TS',
            'country' => 'US',
            'address' => '123 Test Street, Test City, TS 12345',
            'capacity' => 500,
            'website' => 'https://testvenue.com',
            'phone' => '(555) 123-4567',
            'description' => 'A test venue for testing purposes',
        ];

        $response = $this->post('/venues', $venueData);

        $response->assertRedirect('/venues');
        $this->assertDatabaseHas('venues', $venueData);
    }

    public function test_venue_show_page_loads()
    {
        $venue = Venue::factory()->create();

        $response = $this->get("/venues/{$venue->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('venues/show')
            ->has('venue')
            ->where('venue.id', $venue->id)
        );
    }

    public function test_venue_update()
    {
        $venue = Venue::factory()->create();
        $updatedData = [
            'name' => 'Updated Venue Name',
            'city' => $venue->city,
            'state' => $venue->state,
            'country' => $venue->country,
            'address' => $venue->address,
        ];

        $response = $this->put("/venues/{$venue->id}", $updatedData);

        $response->assertRedirect('/venues');
        $this->assertDatabaseHas('venues', ['id' => $venue->id, 'name' => 'Updated Venue Name']);
    }

    public function test_venue_deletion()
    {
        $venue = Venue::factory()->create();

        $response = $this->delete("/venues/{$venue->id}");

        $response->assertRedirect('/venues');
        $this->assertDatabaseMissing('venues', ['id' => $venue->id]);
    }

    public function test_venue_validation_errors()
    {
        $invalidData = [
            'name' => '',
            'city' => '',
            'country' => '',
            'address' => '',
        ];

        $response = $this->post('/venues', $invalidData);

        $response->assertSessionHasErrors(['name', 'city', 'country', 'address']);
    }
}
