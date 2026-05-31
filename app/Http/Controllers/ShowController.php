<?php

namespace App\Http\Controllers;

use App\Models\Show;
use App\Models\Venue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class ShowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $shows = Show::with('venue')->orderBy('date', 'desc')->paginate(15);

        return Inertia::render('shows/index', [
            'shows' => $shows,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $draftData = Session::get('show_draft', []);
        $draftStep = is_array($draftData) && isset($draftData['step']) && is_numeric($draftData['step']) ? intval($draftData['step']) : 1;
        $stepParam = $request->get('step');
        $step = is_numeric($stepParam) ? intval($stepParam) : $draftStep;
        $venues = Venue::orderBy('name')->get();

        // Get draft data from session if exists
        $draftDataFull = Session::get('show_draft', []);

        return Inertia::render('shows/create', [
            'step' => $step,
            'venues' => $venues,
            'draftData' => $draftDataFull,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response|RedirectResponse|JsonResponse
    {
        $stepRaw = $request->get('step', 1);
        $step = is_numeric($stepRaw) ? (int) $stepRaw : 1;
        $action = $request->get('action', 'next');

        if ($action === 'save_draft') {
            $draftFields = [
                'venue_id',
                'date',
                'time',
                'status',
                'price',
                'description',
                'ticket_url',
            ];

            $incomingDraft = $request->only($draftFields);
            $incomingDraft['step'] = (int) $step;

            /** @var array<string, mixed> $draftData */
            $draftData = Session::get('show_draft', []);
            Session::put('show_draft', array_merge($draftData, $incomingDraft));

            return response()->json(['message' => 'Draft saved successfully']);
        }

        // Validate current step
        $rules = $this->getValidationRules($step);
        /** @var array<string, mixed> $validated */
        $validated = $request->validate($rules);

        // Store draft data in session
        /** @var array<string, mixed> $draftData */
        $draftData = Session::get('show_draft', []);
        $draftData = array_merge($draftData, $validated);
        $draftData['step'] = $action === 'next' && $step < 3
            ? $step + 1
            : $step;
        Session::put('show_draft', $draftData);

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

            /** @var array<string, mixed> $allValidated */
            $allValidated = $request->validate($allRules);
            $draftData = array_merge($draftData, $allValidated);

            // Create the show
            /** @var array<string, mixed> $createData */
            $createData = $draftData;
            Show::create($createData);
            Session::forget('show_draft');

            return redirect()->route('shows.index')->with('success', 'Show created successfully!');
        }

        // Go to next step
        return redirect()->route('shows.create', ['step' => $step + 1]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Show $show): Response
    {
        $show->load('venue');

        return Inertia::render('shows/show', [
            'show' => $show,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Show $show): Response
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
    public function update(Request $request, Show $show): RedirectResponse
    {
        /** @var array<string, mixed> $validated */
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
    public function destroy(Show $show): RedirectResponse
    {
        $show->delete();

        return redirect()->route('shows.index')->with('success', 'Show deleted successfully!');
    }

    /**
     * Get validation rules for each step
     */
    /** @return array<string, mixed> */
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
