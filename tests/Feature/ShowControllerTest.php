<?php

namespace Tests\Feature;

use App\Models\Show;
use App\Models\Venue;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShowControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Venue $venue;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->venue = Venue::factory()->create();
    }

    public function test_shows_index_displays_shows()
    {
        Show::factory()->count(3)->create(['venue_id' => $this->venue->id]);

        $response = $this->actingAs($this->user)->get('/shows');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('shows/index')
            ->has('shows', 3)
        );
    }

    public function test_shows_create_displays_form()
    {
        $response = $this->actingAs($this->user)->get('/shows/create');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('shows/create')
            ->has('venues')
            ->where('step', 1)
        );
    }

    public function test_show_creation_step_validation()
    {
        // Step 1 validation - venue, date, time required
        $response = $this->actingAs($this->user)->post('/shows', [
            'step' => 1,
            'action' => 'next',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['venue_id', 'date', 'time']);

        // Valid step 1 data
        $response = $this->actingAs($this->user)->post('/shows', [
            'venue_id' => $this->venue->id,
            'date' => now()->addDays(7)->format('Y-m-d'),
            'time' => '20:00',
            'step' => 1,
            'action' => 'next',
        ]);

        $response->assertRedirect('/shows/create?step=2');
    }

    public function test_show_creation_with_draft_saving()
    {
        // Save draft at step 1
        $response = $this->actingAs($this->user)->postJson('/shows', [
            'venue_id' => $this->venue->id,
            'date' => now()->addDays(7)->format('Y-m-d'),
            'time' => '20:00',
            'step' => 1,
            'action' => 'save_draft',
        ]);

        $response->assertOk();
        $response->assertJson(['message' => 'Draft saved successfully']);

        // Check draft was saved in session
        $this->assertEquals($this->venue->id, session('show_draft.venue_id'));
        $this->assertEquals(1, session('show_draft.step'));
    }

    public function test_complete_show_creation()
    {
        // Complete all steps
        $showData = [
            'venue_id' => $this->venue->id,
            'date' => now()->addDays(7)->format('Y-m-d'),
            'time' => '20:00',
            'status' => 'on-sale',
            'price' => 25.00,
            'description' => 'An amazing show with special guests',
            'ticket_url' => 'https://tickets.example.com/show1',
            'step' => 3,
            'action' => 'publish',
        ];

        $response = $this->actingAs($this->user)->post('/shows', $showData);

        $response->assertRedirect('/shows');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('shows', [
            'venue_id' => $this->venue->id,
            'status' => 'on-sale',
            'price' => 25.00,
            'description' => 'An amazing show with special guests',
            'ticket_url' => 'https://tickets.example.com/show1',
        ]);
    }

    public function test_show_creation_validation_rules()
    {
        // Test date cannot be in the past
        $response = $this->actingAs($this->user)->post('/shows', [
            'venue_id' => $this->venue->id,
            'date' => now()->subDays(1)->format('Y-m-d'),
            'time' => '20:00',
            'step' => 1,
            'action' => 'next',
        ]);

        $response->assertSessionHasErrors('date');

        // Test invalid price
        $response = $this->actingAs($this->user)->post('/shows', [
            'venue_id' => $this->venue->id,
            'date' => now()->addDays(7)->format('Y-m-d'),
            'time' => '20:00',
            'status' => 'on-sale',
            'price' => -10,
            'step' => 2,
            'action' => 'next',
        ]);

        $response->assertSessionHasErrors('price');
    }

    public function test_show_update()
    {
        $show = Show::factory()->create(['venue_id' => $this->venue->id]);

        $updateData = [
            'venue_id' => $this->venue->id,
            'date' => now()->addDays(14)->format('Y-m-d'),
            'time' => '21:00',
            'status' => 'sold-out',
            'price' => 30.00,
            'description' => 'Updated description',
            'ticket_url' => 'https://tickets.example.com/updated',
        ];

        $response = $this->actingAs($this->user)->put("/shows/{$show->id}", $updateData);

        $response->assertRedirect('/shows');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('shows', array_merge($updateData, ['id' => $show->id]));
    }

    public function test_show_show_displays_show()
    {
        $show = Show::factory()->create(['venue_id' => $this->venue->id]);

        $response = $this->actingAs($this->user)->get("/shows/{$show->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('shows/show')
            ->has('show')
            ->where('show.id', $show->id)
        );
    }

    public function test_show_edit_displays_form()
    {
        $show = Show::factory()->create(['venue_id' => $this->venue->id]);

        $response = $this->actingAs($this->user)->get("/shows/{$show->id}/edit");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('shows/edit')
            ->has('show')
            ->has('venues')
            ->where('show.id', $show->id)
        );
    }

    public function test_show_deletion()
    {
        $show = Show::factory()->create(['venue_id' => $this->venue->id]);

        $response = $this->actingAs($this->user)->delete("/shows/{$show->id}");

        $response->assertRedirect('/shows');
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('shows', ['id' => $show->id]);
    }

    public function test_unauthenticated_user_cannot_access_shows()
    {
        $response = $this->get('/shows');
        $response->assertRedirect('/login');
    }

    public function test_draft_session_persistence()
    {
        // Start creating a show
        $this->actingAs($this->user)->post('/shows', [
            'venue_id' => $this->venue->id,
            'date' => now()->addDays(7)->format('Y-m-d'),
            'time' => '20:00',
            'step' => 1,
            'action' => 'next',
        ]);

        // Navigate away and come back
        $response = $this->actingAs($this->user)->get('/shows/create');

        $response->assertInertia(fn ($page) => $page
            ->where('step', 2)
            ->where('draftData.venue_id', $this->venue->id)
        );
    }

    public function test_step_navigation_validation()
    {
        // Try to jump to step 3 without completing step 1
        $response = $this->actingAs($this->user)->post('/shows', [
            'step' => 3,
            'action' => 'publish',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['venue_id', 'date', 'time']);
    }
}