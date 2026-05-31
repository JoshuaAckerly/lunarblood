<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
{
    public function index(): Response
    {
        $venues = Venue::withCount('shows')->paginate(12);

        return Inertia::render('venues/index', [
            'venues' => $venues,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('venues/create');
    }

    public function store(Request $request): RedirectResponse
    {
        /** @var array<string, mixed> $validated */
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'address' => 'required|string',
            'capacity' => 'nullable|integer|min:1',
            'website' => 'nullable|url',
            'phone' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|url',
        ]);

        Venue::create($validated);

        return redirect()->route('venues.index')->with('success', 'Venue created successfully.');
    }

    public function show(Venue $venue): Response
    {
        $venue->load('shows');

        return Inertia::render('venues/show', [
            'venue' => $venue,
        ]);
    }

    public function edit(Venue $venue): Response
    {
        return Inertia::render('venues/edit', [
            'venue' => $venue,
        ]);
    }

    public function update(Request $request, Venue $venue): RedirectResponse
    {
        /** @var array<string, mixed> $validated */
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'address' => 'required|string',
            'capacity' => 'nullable|integer|min:1',
            'website' => 'nullable|url',
            'phone' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|url',
        ]);

        $venue->update($validated);

        return redirect()->route('venues.index')->with('success', 'Venue updated successfully.');
    }

    public function destroy(Venue $venue): RedirectResponse
    {
        $venue->delete();

        return redirect()->route('venues.index')->with('success', 'Venue deleted successfully.');
    }
}
