<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Show extends Model
{
    /** @phpstan-ignore missingType.generics */
    use HasFactory;

    protected $fillable = [
        'venue_id',
        'date',
        'time',
        'status',
        'ticket_url',
        'price',
        'description',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i',
        'price' => 'decimal:2',
    ];

    /** @return BelongsTo<Venue, $this> */
    public function venue(): BelongsTo
    {
        // @phpstan-ignore-next-line return.type
        return $this->belongsTo(Venue::class);
    }
}
