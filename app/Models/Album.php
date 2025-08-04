<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Album extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'type',
        'release_date',
        'description',
        'cover_image',
        'spotify_url',
        'bandcamp_url',
        'apple_music_url',
        'featured',
    ];

    protected $casts = [
        'release_date' => 'date',
        'featured' => 'boolean',
    ];

    public function tracks(): HasMany
    {
        return $this->hasMany(Track::class)->orderBy('track_number');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }
}
