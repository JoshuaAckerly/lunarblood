<?php

namespace Database\Seeders;

use App\Models\Venue;
use App\Models\Show;
use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        $venues = [
            [
                'name' => 'The Underground',
                'city' => 'Seattle',
                'state' => 'WA',
                'address' => '123 Dark Street, Seattle, WA 98101',
                'capacity' => 500,
                'website' => 'https://theunderground.com',
                'phone' => '(206) 555-0123',
                'description' => 'An intimate underground venue known for its incredible acoustics and dark atmosphere.',
            ],
            [
                'name' => 'Dark Moon Club',
                'city' => 'Portland',
                'state' => 'OR',
                'address' => '456 Shadow Ave, Portland, OR 97201',
                'capacity' => 300,
                'website' => 'https://darkmoonclub.com',
                'phone' => '(503) 555-0456',
                'description' => 'Portland\'s premier venue for heavy and atmospheric music.',
            ],
            [
                'name' => 'Crimson Hall',
                'city' => 'San Francisco',
                'state' => 'CA',
                'address' => '789 Blood St, San Francisco, CA 94102',
                'capacity' => 800,
                'website' => 'https://crimsonhall.com',
                'phone' => '(415) 555-0789',
                'description' => 'A legendary venue that has hosted the best in dark music for decades.',
            ],
        ];

        foreach ($venues as $venueData) {
            $venue = Venue::create($venueData);
            
            // Create shows for each venue
            Show::create([
                'venue_id' => $venue->id,
                'date' => '2024-03-15',
                'time' => '20:00',
                'status' => 'on-sale',
                'ticket_url' => 'https://tickets.com/lunar-blood-' . strtolower($venue->city),
                'price' => 25.00,
            ]);
        }
    }
}
