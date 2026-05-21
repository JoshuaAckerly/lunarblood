<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Album extends Model
{
    /** @phpstan-ignore missingType.generics */
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

    /** @return HasMany<Track, $this> */
    public function tracks(): HasMany
    {
        // @phpstan-ignore-next-line return.type
        return $this->hasMany(Track::class)->orderBy('track_number');
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeFeatured(Builder $query): Builder
    {
        // @phpstan-ignore-next-line return.type
        return $query->where('featured', true);
    }
}
