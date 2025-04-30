<?php

namespace App\Http\Controllers;

use App\Models\Administration;
use App\Models\Period;
use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodController extends Controller
{
    /**
     * Display a listing of the periods.
     */
    public function index()
    {
        $periods = Period::select('id', 'name', 'start_date', 'end_date', 'description')
            ->get()
            ->map(function ($period) {
                return [
                    'id' => (string)$period->id,
                    'name' => $period->name,
                    'startTime' => $period->formatted_start_date,
                    'endTime' => $period->formatted_end_date,
                    'description' => $period->description,
                ];
            });

        return Inertia::render('admin/periods/index', [
            'periods' => $periods
        ]);
    }

    /**
     * Show the form for creating a new period.
     */
    public function create()
    {
        return Inertia::render('admin/periods/create');
    }

    /**
     * Store a newly created period in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
        ]);

        Period::create($validated);

        return redirect()->route('periods.index')
            ->with('success', 'Period created successfully.');
    }

    /**
     * Display the specified period.
     */
    public function show(Period $period)
    {
        return Inertia::render('admin/periods/show', [
            'period' => [
                'id' => $period->id,
                'name' => $period->name,
                'startTime' => $period->formatted_start_date,
                'endTime' => $period->formatted_end_date,
                'description' => $period->description,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified period.
     */
    public function edit(Period $period)
    {
        return Inertia::render('admin/periods/edit', [
            'period' => $period
        ]);
    }

    /**
     * Update the specified period in storage.
     */
    public function update(Request $request, Period $period)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
        ]);

        $period->update($validated);

        return redirect()->route('periods.index')
            ->with('success', 'Period updated successfully.');
    }

    /**
     * Remove the specified period from storage.
     */
    public function destroy(Period $period)
    {
        $period->delete();

        return redirect()->route('periods.index')
            ->with('success', 'Period deleted successfully.');
    }
    
    /**
     * Show companies for a specific period.
     */
    public function company(Request $request)
    {
        $periodId = $request->query('periodId');
        
        // Logic to display companies for this period
        
        return Inertia::render('admin/periods/company', [
            'periodId' => $periodId
        ]);
    }

    /**
     * Show the administration page for a specific company, filtered by period.
     */
    public function administration(Request $request, $companyId)
    {
        $selectedPeriodId = $request->query('periodId');
        
        // Get candidates for this company and period
        $candidates = Candidate::whereHas('administrations', function ($query) use ($companyId, $selectedPeriodId) {
            $query->where('company_id', $companyId);
            if ($selectedPeriodId) {
                $query->where('period_id', $selectedPeriodId);
            }
        })
        ->with(['user', 'administrations.vacancy'])
        ->get()
        ->map(function ($candidate) {
            return [
                'id' => (string)$candidate->id,
                'name' => $candidate->user->name,
                'email' => $candidate->user->email,
                'position' => $candidate->administrations->first()?->vacancy->title ?? 'Unknown',
                'registration_date' => $candidate->created_at->format('M d, Y'),
                'period' => $candidate->administrations->first()?->period->name ?? 'Unknown',
                'periodId' => (string)($candidate->administrations->first()?->period_id ?? ''),
            ];
        });

        $company = Company::find($companyId);
        
        return Inertia::render('admin/company/administration', [
            'candidates' => $candidates,
            'companyName' => $company->name,
            'companyId' => $companyId,
        ]);
    }
}
