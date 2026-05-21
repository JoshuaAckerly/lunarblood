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
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeActive(Builder $query): Builder
    {
        // @phpstan-ignore-next-line return.type
        return $query->where('active', true);
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeInStock(Builder $query): Builder
    {
        // @phpstan-ignore-next-line return.type
        return $query->where('stock', '>', 0);
    }
}
