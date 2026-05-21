<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venue extends Model
{
    /** @phpstan-ignore missingType.generics */
    use HasFactory;

    protected $fillable = [
        'name',
        'city',
        'state',
        'country',
        'address',
        'capacity',
        'website',
        'phone',
        'description',
        'image',
    ];

    protected $casts = [
        'capacity' => 'integer',
    ];

    /** @return HasMany<Show, $this> */
    public function shows(): HasMany
    {
        // @phpstan-ignore-next-line return.type
        return $this->hasMany(Show::class);
    }
}
