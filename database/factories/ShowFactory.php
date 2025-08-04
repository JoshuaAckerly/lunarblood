<?php

namespace Database\Factories;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShowFactory extends Factory
{
    public function definition(): array
    {
        return [
            'venue_id' => Venue::factory(),
            'date' => $this->faker->dateTimeBetween('now', '+6 months')->format('Y-m-d'),
            'time' => $this->faker->time('H:i'),
            'status' => $this->faker->randomElement(['coming-soon', 'on-sale', 'sold-out']),
            'ticket_url' => $this->faker->url,
            'price' => $this->faker->randomFloat(2, 15, 75),
            'description' => $this->faker->sentence,
        ];
    }
}
