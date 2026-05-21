<?php

namespace Tests\Feature;

use App\Models\Show;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ShowTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Venue $venue;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        /** @var Venue $venue */
        $venue = Venue::factory()->create();
        $this->venue = $venue;
    }

    public function test_shows_index_displays_shows(): void
    {
        Show::factory()->count(3)->create(['venue_id' => $this->venue->id]);

        $response = $this->actingAs($this->user)->get('/shows');

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('shows/index')
            ->has('shows', 3)
        );
    }

    public function test_show_page_displays_show(): void
    {
        /** @var Show $show */
        $show = Show::factory()->create(['venue_id' => $this->venue->id]);

        $response = $this->actingAs($this->user)->get("/shows/{$show->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('shows/show')
            ->has('show')
            ->where('show.id', $show->id)
        );
    }

    public function test_show_creation(): void
    {
        $showData = [
            'venue_id' => $this->venue->id,
            'date' => now()->addDays(14)->format('Y-m-d'),
            'time' => '20:00',
            'status' => 'on-sale',
            'price' => 25.00,
            'description' => 'A great show',
            'ticket_url' => 'https://tickets.example.com/show1',
            'step' => 3,
            'action' => 'publish',
        ];

        $response = $this->actingAs($this->user)->post('/shows', $showData);

        $response->assertRedirect('/shows');
        $this->assertDatabaseHas('shows', [
            'venue_id' => $this->venue->id,
            'status' => 'on-sale',
            'description' => 'A great show',
            'ticket_url' => 'https://tickets.example.com/show1',
        ]);
    }

    public function test_show_update(): void
    {
        /** @var Show $show */
        $show = Show::factory()->create(['venue_id' => $this->venue->id]);

        $updateData = [
            'venue_id' => $this->venue->id,
            'date' => now()->addDays(21)->format('Y-m-d'),
            'time' => '21:00',
            'status' => 'sold-out',
            'price' => 35.00,
            'description' => 'Updated description',
            'ticket_url' => 'https://tickets.example.com/updated',
        ];

        $response = $this->actingAs($this->user)->put("/shows/{$show->id}", $updateData);

        $response->assertRedirect("/shows/{$show->id}");
        $this->assertDatabaseHas('shows', [
            'id' => $show->id,
            'status' => 'sold-out',
            'description' => 'Updated description',
        ]);
    }

    public function test_show_deletion(): void
    {
        /** @var Show $show */
        $show = Show::factory()->create(['venue_id' => $this->venue->id]);

        $response = $this->actingAs($this->user)->delete("/shows/{$show->id}");

        $response->assertRedirect('/shows');
        $this->assertDatabaseMissing('shows', ['id' => $show->id]);
    }

    public function test_show_validation_requires_fields(): void
    {
        $response = $this->actingAs($this->user)->post('/shows', [
            'step' => 1,
            'action' => 'next',
        ]);

        $response->assertSessionHasErrors(['venue_id', 'date', 'time']);
    }

    public function test_unauthenticated_user_cannot_access_shows(): void
    {
        $response = $this->get('/shows');

        $response->assertRedirect('/login');
    }
}
