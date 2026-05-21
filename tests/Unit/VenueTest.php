<?php

namespace Tests\Unit;

use App\Models\Show;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

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
        /** @var \App\Models\Venue $venue */
        $venue = Venue::factory()->create();
        $show = Show::factory()->create(['venue_id' => $venue->id]);

        /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\Show> $shows */
        $shows = $venue->shows;
        $this->assertTrue($shows->contains($show));
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
