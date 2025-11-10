<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Lunar Blood T-Shirt',
                'description' => 'Black cotton tee with band logo',
                'price' => 25.00,
                'category' => 'apparel',
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'stock' => 50,
            ],
            [
                'name' => 'Blood Moon Vinyl',
                'description' => 'Limited edition red vinyl LP',
                'price' => 35.00,
                'category' => 'music',
                'stock' => 25,
            ],
            [
                'name' => 'Dark Horizons Hoodie',
                'description' => 'Premium black hoodie with album art',
                'price' => 45.00,
                'category' => 'apparel',
                'sizes' => ['S', 'M', 'L', 'XL'],
                'stock' => 30,
            ],
            [
                'name' => 'Band Patch Set',
                'description' => 'Set of 3 embroidered patches',
                'price' => 15.00,
                'category' => 'accessories',
                'stock' => 100,
            ],
            [
                'name' => 'Shadows & Echoes CD',
                'description' => 'Latest EP in jewel case',
                'price' => 20.00,
                'category' => 'music',
                'stock' => 75,
            ],
            [
                'name' => 'Logo Beanie',
                'description' => 'Embroidered logo beanie',
                'price' => 18.00,
                'category' => 'accessories',
                'stock' => 40,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
