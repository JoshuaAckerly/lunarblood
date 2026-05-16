<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Show;
use App\Models\Venue;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->string('q'));

        if ($q === '') {
            return Inertia::render('search', [
                'query' => '',
                'results' => ['venues' => [], 'shows' => [], 'products' => []],
            ]);
        }

        $like = '%'.$q.'%';

        $venues = Venue::where('name', 'LIKE', $like)
            ->orWhere('city', 'LIKE', $like)
            ->orWhere('description', 'LIKE', $like)
            ->select('id', 'name', 'city', 'state', 'country', 'description')
            ->orderBy('name')
            ->limit(10)
            ->get();

        $shows = Show::with('venue:id,name,city,state')
            ->where(function ($query) use ($like): void {
                $query->where('description', 'LIKE', $like)
                    ->orWhereHas('venue', fn ($v) => $v->where('name', 'LIKE', $like)->orWhere('city', 'LIKE', $like));
            })
            ->select('id', 'venue_id', 'date', 'status', 'ticket_url', 'price')
            ->orderBy('date')
            ->limit(10)
            ->get()
            ->map(fn ($show) => [
                'id' => $show->id,
                'date' => $show->date?->format('M j, Y'),
                'venue' => $show->venue?->name,
                'city' => $show->venue?->city,
                'state' => $show->venue?->state,
                'status' => $show->status,
                'ticket_url' => $show->ticket_url,
                'price' => $show->price,
            ]);

        $products = Product::active()
            ->where(function ($query) use ($like): void {
                $query->where('name', 'LIKE', $like)
                    ->orWhere('description', 'LIKE', $like)
                    ->orWhere('category', 'LIKE', $like);
            })
            ->select('id', 'name', 'description', 'price', 'category')
            ->orderBy('name')
            ->limit(10)
            ->get();

        return Inertia::render('search', [
            'query' => $q,
            'results' => [
                'venues' => $venues,
                'shows' => $shows,
                'products' => $products,
            ],
        ]);
    }
}
