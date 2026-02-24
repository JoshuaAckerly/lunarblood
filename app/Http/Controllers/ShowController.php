<?php

namespace App\Http\Controllers;

use App\Models\Show;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class ShowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shows = Show::with('venue')->orderBy('date', 'desc')->get();

        return Inertia::render('shows/index', [
            'shows' => $shows,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $step = $request->get('step', 1);
        $venues = Venue::orderBy('name')->get();

        // Get draft data from session if exists
        $draftData = Session::get('show_draft', []);

        return Inertia::render('shows/create', [
            'step' => $step,
            'venues' => $venues,
            'draftData' => $draftData,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $step = $request->get('step', 1);
        $action = $request->get('action', 'next');

        // Validate current step
        $rules = $this->getValidationRules($step);
        $validated = $request->validate($rules);

        // Store draft data in session
        $draftData = Session::get('show_draft', []);
        $draftData = array_merge($draftData, $validated);
        Session::put('show_draft', $draftData);

        if ($action === 'save_draft') {
            return response()->json(['message' => 'Draft saved successfully']);
        }

        if ($action === 'publish' || $step >= 3) {
            // Validate all required fields before creating
            $allRules = [
                'venue_id' => 'required|exists:venues,id',
                'date' => 'required|date|after:today',
                'time' => 'required|date_format:H:i',
                'status' => 'required|in:coming-soon,on-sale,sold-out,cancelled',
                'price' => 'nullable|numeric|min:0',
                'description' => 'nullable|string|max:1000',
                'ticket_url' => 'nullable|url',
            ];

            $request->validate($allRules);

            // Create the show
            $show = Show::create($draftData);
            Session::forget('show_draft');

            return redirect()->route('shows.index')->with('success', 'Show created successfully!');
        }

        // Go to next step
        return redirect()->route('shows.create', ['step' => $step + 1]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Show $show)
    {
        $show->load('venue');

        return Inertia::render('shows/show', [
            'show' => $show,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Show $show)
    {
        $venues = Venue::orderBy('name')->get();

        return Inertia::render('shows/edit', [
            'show' => $show,
            'venues' => $venues,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Show $show)
    {
        $validated = $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'date' => 'required|date|after:today',
            'time' => 'required|date_format:H:i',
            'status' => 'required|in:coming-soon,on-sale,sold-out,cancelled',
            'ticket_url' => 'nullable|url',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:1000',
        ]);

        $show->update($validated);

        return redirect()->route('shows.show', $show)->with('success', 'Show updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Show $show)
    {
        $show->delete();

        return redirect()->route('shows.index')->with('success', 'Show deleted successfully!');
    }

    /**
     * Get validation rules for each step
     */
    private function getValidationRules(int $step): array
    {
        $rules = [];

        switch ($step) {
            case 1: // Basic info
                $rules = [
                    'venue_id' => 'required|exists:venues,id',
                    'date' => 'required|date|after:today',
                    'time' => 'required|date_format:H:i',
                ];
                break;
            case 2: // Details
                $rules = [
                    'status' => 'required|in:coming-soon,on-sale,sold-out,cancelled',
                    'price' => 'nullable|numeric|min:0',
                    'description' => 'nullable|string|max:1000',
                ];
                break;
            case 3: // Tickets & publishing
                $rules = [
                    'ticket_url' => 'nullable|url',
                ];
                break;
        }

        return $rules;
    }
}
