<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Models\Company;
use App\Models\Vacancies;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PeriodController extends Controller
{
    public function index(Request $request)
    {
        $companyId = $request->query('companyId');
        $company = null;
        
        // Get the company if ID is provided
        if ($companyId) {
            $company = Company::find($companyId);
        }
        
        // Get periods with associated vacancies, filtered by company if provided
        $periodsQuery = Period::with('vacancy');
        
        if ($companyId) {
            // Filter by vacancies that belong to the selected company
            $periodsQuery->whereHas('vacancy', function ($query) use ($companyId) {
                $query->where('company_id', $companyId);
            });
        }
        
        $periods = $periodsQuery->get();
        
        // Format the data to include dates from the associated vacancy
        $periodsData = $periods->map(function ($period) {
            $data = $period->toArray();
            
            // Add vacancy dates if available
            if ($period->vacancy) {
                $data['start_date'] = $period->vacancy->start_date;
                $data['end_date'] = $period->vacancy->end_date;
                $data['company'] = $period->vacancy->company ? $period->vacancy->company->name : null;
            } else {
                $data['start_date'] = null;
                $data['end_date'] = null;
                $data['company'] = null;
            }
            
            return $data;
        });

        // Ensure we're rendering the periods page, not dashboard
        return Inertia::render('admin/periods/index', [
            'periods' => $periodsData,
            'company' => $company ? [
                'id' => $company->id,
                'name' => $company->name
            ] : null,
            'filtering' => !empty($companyId)
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/periods/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'vacancies_id' => 'required|exists:vacancies,id',
        ]);

        $period = Period::create($validated);

        // Redirect back with company filter if it was provided
        if ($request->has('companyId')) {
            return redirect()->route('periods.index', ['companyId' => $request->companyId])
                ->with('success', 'Period created successfully');
        }

        return redirect()->route('periods.index')
            ->with('success', 'Period created successfully');
    }

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

    public function edit(Period $period)
    {
        return Inertia::render('admin/periods/edit', [
            'period' => $period
        ]);
    }

    public function update(Request $request, Period $period)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'vacancies_id' => 'required|exists:vacancies,id',
        ]);

        $period->update($validated);

        return redirect()->route('periods.index')
            ->with('success', 'Period updated successfully');
    }

    public function destroy(Period $period)
    {
        $period->delete();

        return redirect()->route('periods.index')
            ->with('success', 'Period deleted successfully');
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
