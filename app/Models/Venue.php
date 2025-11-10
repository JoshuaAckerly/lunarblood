<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venue extends Model
{
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

    public function shows(): HasMany
    {
        return $this->hasMany(Show::class);
    }
}
