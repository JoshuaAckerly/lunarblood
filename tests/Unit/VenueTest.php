<?php

namespace Tests\Unit;

use App\Models\Venue;
use App\Models\Show;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;

class VenueTest extends TestCase
{
    use RefreshDatabase;

    public function test_venue_can_be_created(): void
    {
        $venue = Venue::create([
            'name' => 'Test Venue',
            'city' => 'Seattle',
            'state' => 'WA',
            'address' => '123 Test St',
            'capacity' => 500,
        ]);

        $this->assertDatabaseHas('venues', [
            'name' => 'Test Venue',
            'city' => 'Seattle',
        ]);
    }

    public function test_venue_has_shows_relationship(): void
    {
        $venue = Venue::factory()->create();
        $show = Show::factory()->create(['venue_id' => $venue->id]);

        $this->assertTrue($venue->shows->contains($show));
    }

    public function test_venue_capacity_is_cast_to_integer(): void
    {
        $venue = Venue::create([
            'name' => 'Test Venue',
            'city' => 'Seattle',
            'address' => '123 Test St',
            'capacity' => '500',
        ]);

        $this->assertIsInt($venue->capacity);
        $this->assertEquals(500, $venue->capacity);
    }
}
