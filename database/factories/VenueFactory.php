<?php

namespace Database\Factories;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Venue> */
class VenueFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company.' Hall',
            'city' => $this->faker->city,
            'state' => $this->faker->randomElement(['AL', 'AK', 'AZ', 'CA', 'CO', 'FL', 'GA', 'NY', 'OR', 'TX', 'WA']),
            'country' => 'US',
            'address' => $this->faker->streetAddress,
            'capacity' => $this->faker->numberBetween(100, 2000),
            'website' => $this->faker->url,
            'phone' => $this->faker->phoneNumber,
            'description' => $this->faker->paragraph,
        ];
    }
}
