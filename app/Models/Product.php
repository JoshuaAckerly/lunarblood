<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @phpstan-ignore missingType.generics */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'sizes',
        'image',
        'stock',
        'active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sizes' => 'array',
        'stock' => 'integer',
        'active' => 'boolean',
    ];

    /**
     * @param \Illuminate\Database\Eloquent\Builder<static> $query
     * @return \Illuminate\Database\Eloquent\Builder<static>
     */
    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        // @phpstan-ignore-next-line return.type
        return $query->where('active', true);
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder<static> $query
     * @return \Illuminate\Database\Eloquent\Builder<static>
     */
    public function scopeInStock(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        // @phpstan-ignore-next-line return.type
        return $query->where('stock', '>', 0);
    }
}
