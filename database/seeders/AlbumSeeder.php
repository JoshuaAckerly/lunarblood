<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Track;
use Illuminate\Database\Seeder;

class AlbumSeeder extends Seeder
{
    public function run(): void
    {
        // Create Shadows & Echoes EP
        $shadowsEP = Album::create([
            'title' => 'Shadows & Echoes',
            'type' => 'ep',
            'release_date' => '2024-01-15',
            'description' => 'Our latest EP explores the depths of human emotion through haunting melodies and crushing riffs.',
            'spotify_url' => 'https://open.spotify.com/album/shadows-echoes',
            'bandcamp_url' => 'https://lunarblood.bandcamp.com/album/shadows-echoes',
            'apple_music_url' => 'https://music.apple.com/album/shadows-echoes',
            'featured' => true,
        ]);

        // Add tracks to Shadows & Echoes
        $shadowsTracks = [
            ['title' => 'Midnight Reverie', 'track_number' => 1, 'duration' => 245],
            ['title' => 'Crimson Tide', 'track_number' => 2, 'duration' => 312],
            ['title' => 'Void Walker', 'track_number' => 3, 'duration' => 198],
        ];

        foreach ($shadowsTracks as $trackData) {
            Track::create(array_merge($trackData, ['album_id' => $shadowsEP->id]));
        }

        // Create Blood Moon Rising Album
        $bloodMoon = Album::create([
            'title' => 'Blood Moon Rising',
            'type' => 'album',
            'release_date' => '2023-10-31',
            'description' => 'A full-length journey through darkness and light, featuring our most ambitious compositions.',
            'spotify_url' => 'https://open.spotify.com/album/blood-moon-rising',
            'bandcamp_url' => 'https://lunarblood.bandcamp.com/album/blood-moon-rising',
            'featured' => false,
        ]);

        // Add tracks to Blood Moon Rising
        $bloodMoonTracks = [
            ['title' => 'Eclipse', 'track_number' => 1, 'duration' => 287],
            ['title' => 'Lunar Descent', 'track_number' => 2, 'duration' => 334],
            ['title' => 'Blood Moon Rising', 'track_number' => 3, 'duration' => 412],
            ['title' => 'Shadow Dance', 'track_number' => 4, 'duration' => 298],
            ['title' => 'Dawn\'s End', 'track_number' => 5, 'duration' => 356],
        ];

        foreach ($bloodMoonTracks as $trackData) {
            Track::create(array_merge($trackData, ['album_id' => $bloodMoon->id]));
        }

        // Create Dark Horizons Single
        $darkHorizons = Album::create([
            'title' => 'Dark Horizons',
            'type' => 'single',
            'release_date' => '2022-06-21',
            'description' => 'Our breakthrough single that introduced the world to our unique sound.',
            'spotify_url' => 'https://open.spotify.com/track/dark-horizons',
            'featured' => false,
        ]);

        Track::create([
            'album_id' => $darkHorizons->id,
            'title' => 'Dark Horizons',
            'track_number' => 1,
            'duration' => 267,
        ]);
    }
}
