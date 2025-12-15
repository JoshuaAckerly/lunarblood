<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Product;
use App\Models\Show;
use App\Models\Venue;
use Carbon\Carbon;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = config('app.url');
        $now = Carbon::now()->toW3cString();

        // Static pages
        $staticPages = [
            ['loc' => $baseUrl, 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => $baseUrl . '/listen', 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => $baseUrl . '/tour', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['loc' => $baseUrl . '/venues', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => $baseUrl . '/shop', 'priority' => '0.8', 'changefreq' => 'weekly'],
        ];

        // Dynamic content
        $venues = Venue::all()->map(function ($venue) use ($baseUrl) {
            return [
                'loc' => $baseUrl . '/venues/' . $venue->id,
                'lastmod' => $venue->updated_at->toW3cString(),
                'priority' => '0.7',
                'changefreq' => 'weekly'
            ];
        });

        $products = Product::all()->map(function ($product) use ($baseUrl) {
            return [
                'loc' => $baseUrl . '/shop/' . $product->id,
                'lastmod' => $product->updated_at->toW3cString(),
                'priority' => '0.7',
                'changefreq' => 'monthly'
            ];
        });

        // Merge all URLs
        $urls = collect($staticPages)->merge($venues)->merge($products);

        $xml = view('sitemap', [
            'urls' => $urls,
            'now' => $now
        ])->render();

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }
}
