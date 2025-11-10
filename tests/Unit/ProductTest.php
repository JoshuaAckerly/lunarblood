<?php

namespace Tests\Unit;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_can_be_created(): void
    {
        $product = Product::create([
            'name' => 'Test T-Shirt',
            'description' => 'A test product',
            'price' => 25.99,
            'category' => 'apparel',
            'sizes' => ['S', 'M', 'L'],
            'stock' => 10,
        ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Test T-Shirt',
            'category' => 'apparel',
        ]);
    }

    public function test_product_sizes_are_cast_to_array(): void
    {
        $product = Product::create([
            'name' => 'Test Product',
            'description' => 'Test',
            'price' => 20.00,
            'category' => 'apparel',
            'sizes' => ['S', 'M', 'L'],
        ]);

        $this->assertIsArray($product->sizes);
        $this->assertEquals(['S', 'M', 'L'], $product->sizes);
    }

    public function test_active_scope_filters_active_products(): void
    {
        Product::create(['name' => 'Active Product', 'description' => 'Test', 'price' => 20, 'category' => 'music', 'active' => true]);
        Product::create(['name' => 'Inactive Product', 'description' => 'Test', 'price' => 20, 'category' => 'music', 'active' => false]);

        $activeProducts = Product::active()->get();

        $this->assertCount(1, $activeProducts);
        $this->assertEquals('Active Product', $activeProducts->first()->name);
    }

    public function test_in_stock_scope_filters_products_with_stock(): void
    {
        Product::create(['name' => 'In Stock', 'description' => 'Test', 'price' => 20, 'category' => 'music', 'stock' => 5]);
        Product::create(['name' => 'Out of Stock', 'description' => 'Test', 'price' => 20, 'category' => 'music', 'stock' => 0]);

        $inStockProducts = Product::inStock()->get();

        $this->assertCount(1, $inStockProducts);
        $this->assertEquals('In Stock', $inStockProducts->first()->name);
    }
}
