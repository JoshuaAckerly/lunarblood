<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_profile_settings_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/settings/profile');

        $response->assertStatus(200);
    }

    public function test_profile_update_requires_valid_data(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patch('/settings/profile', [
            'name' => '',
            'email' => 'not-an-email',
        ]);

        $response->assertSessionHasErrors(['name', 'email']);
    }

    public function test_authenticated_user_can_update_profile(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patch('/settings/profile', [
            'name' => 'Updated User',
            'email' => 'updated@example.com',
        ]);

        $response->assertRedirect('/settings/profile');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated User',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_guest_cannot_update_profile(): void
    {
        $response = $this->patch('/settings/profile', [
            'name' => 'Guest User',
            'email' => 'guest@example.com',
        ]);

        $response->assertRedirect('/login');
    }
}
