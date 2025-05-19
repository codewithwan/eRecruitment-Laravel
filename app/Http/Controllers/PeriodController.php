<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Models\Company;
use App\Models\Vacancies;
use App\Models\Applicant;
use Carbon\Carbon;
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
        $periodsQuery = Period::with('vacancies.company', 'vacancies.questionPack');
        
        if ($companyId) {
            // Filter by vacancies that belong to the selected company
            $periodsQuery->whereHas('vacancies', function ($query) use ($companyId) {
                $query->where('company_id', $companyId);
            });
        }
        
        $periods = $periodsQuery->get();
        
        // Get current date for status checking
        $now = Carbon::now();
        
        // Format the data to include dates from the associated vacancies
        $periodsData = $periods->map(function ($period) use ($now) {
            $data = $period->toArray();
            
            // Add start_time and end_time
            $data['start_date'] = $period->start_time ? Carbon::parse($period->start_time)->format('d/m/Y') : null;
            $data['end_date'] = $period->end_time ? Carbon::parse($period->end_time)->format('d/m/Y') : null;
            
            // Calculate status based on current date
            if ($period->start_time && $period->end_time) {
                $startTime = Carbon::parse($period->start_time);
                $endTime = Carbon::parse($period->end_time);
                
                if ($now->lt($startTime)) {
                    $data['status'] = 'Upcoming';
                } elseif ($now->gt($endTime)) {
                    $data['status'] = 'Closed';
                } else {
                    $data['status'] = 'Open';
                }
            } else {
                $data['status'] = 'Not Set';
            }
            
            // Add vacancy and question pack information if available
            if ($period->vacancies->isNotEmpty()) {
                $firstVacancy = $period->vacancies->first();
                $data['title'] = $firstVacancy->title ?? null;
                $data['department'] = $firstVacancy->department ?? null;
                $data['question_pack'] = $firstVacancy->questionPack ? $firstVacancy->questionPack->pack_name : null;
                // Count applicants for this period
                $data['applicants_count'] = $period->applicants()->count();
            } else {
                $data['title'] = null;
                $data['department'] = null;
                $data['question_pack'] = null;
                $data['applicants_count'] = 0;
            }
            
            return $data;
        });

        // Get available vacancies for the period dropdown
        $vacancies = Vacancies::select('id', 'title', 'department')
            ->when($companyId, function($query) use ($companyId) {
                return $query->where('company_id', $companyId);
            })
            ->get()
            ->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->department,
                ];
            });

        // Ensure we're rendering the periods page
        return Inertia::render('admin/periods/index', [
            'periods' => $periodsData,
            'company' => $company ? [
                'id' => $company->id,
                'name' => $company->name
            ] : null,
            'filtering' => !empty($companyId),
            'vacancies' => $vacancies
        ]);
    }

    public function create()
    {
        $vacancies = Vacancies::with('company')
            ->select('id', 'title', 'department', 'company_id')
            ->get()
            ->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->department,
                    'company' => $vacancy->company ? $vacancy->company->name : null
                ];
            });
            
        return Inertia::render('admin/periods/create', [
            'vacancies' => $vacancies
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'vacancies_ids' => 'required|array',
            'vacancies_ids.*' => 'exists:vacancies,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        // Create new period
        $period = Period::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);
        
        // Attach vacancies to this period
        $period->vacancies()->attach($validated['vacancies_ids']);

        // Get the period with its associated vacancies for the response
        $period->load('vacancies.company', 'vacancies.questionPack');
        
        // Get current date for status checking
        $now = Carbon::now();
        
        $periodData = [
            'id' => $period->id,
            'name' => $period->name,
            'description' => $period->description,
            'start_date' => Carbon::parse($period->start_time)->format('d/m/Y'),
            'end_date' => Carbon::parse($period->end_time)->format('d/m/Y'),
            'status' => $now->lt(Carbon::parse($period->start_time)) ? 'Upcoming' : 
                      ($now->gt(Carbon::parse($period->end_time)) ? 'Closed' : 'Open'),
            'vacancies' => $period->vacancies->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->department,
                    'company' => $vacancy->company ? $vacancy->company->name : null,
                ];
            })
        ];

        // Redirect back with company filter if it was provided
        if ($request->ajax() || $request->expectsJson()) {
            return response()->json([
                'message' => 'Period created successfully',
                'period' => $periodData
            ]);
        }

        if ($request->has('companyId')) {
            return redirect()->route('admin.periods.index', ['companyId' => $request->companyId])
                ->with('success', 'Period created successfully');
        }

        return redirect()->route('admin.periods.index')
            ->with('success', 'Period created successfully');
    }

    public function show(Period $period)
    {
        $period->load('vacancies.company', 'applicants.user', 'applicants.vacancy', 'applicants.status');
        
        // Get current date for status checking
        $now = Carbon::now();
        $status = 'Not Set';
        
        if ($period->start_time && $period->end_time) {
            $startTime = Carbon::parse($period->start_time);
            $endTime = Carbon::parse($period->end_time);
            
            if ($now->lt($startTime)) {
                $status = 'Upcoming';
            } elseif ($now->gt($endTime)) {
                $status = 'Closed';
            } else {
                $status = 'Open';
            }
        }
        
        $applicantsData = $period->applicants->map(function ($applicant) {
            return [
                'id' => $applicant->id,
                'name' => $applicant->user->name,
                'email' => $applicant->user->email,
                'position' => $applicant->vacancy->title ?? 'Unknown',
                'status' => $applicant->status->name ?? 'Pending',
                'applied_at' => $applicant->applied_at->format('M d, Y'),
            ];
        });
        
        return Inertia::render('admin/periods/show', [
            'period' => [
                'id' => $period->id,
                'name' => $period->name,
                'description' => $period->description,
                'start_date' => $period->start_time ? Carbon::parse($period->start_time)->format('d/m/Y') : null,
                'end_date' => $period->end_time ? Carbon::parse($period->end_time)->format('d/m/Y') : null,
                'status' => $status,
                'vacancies' => $period->vacancies->map(function ($vacancy) {
                    return [
                        'id' => $vacancy->id,
                        'title' => $vacancy->title,
                        'department' => $vacancy->department,
                        'company' => $vacancy->company ? $vacancy->company->name : null,
                    ];
                }),
                'applicants_count' => $period->applicants->count(),
            ],
            'applicants' => $applicantsData
        ]);
    }

    public function edit(Period $period)
    {
        $period->load('vacancies');
        
        $vacancies = Vacancies::with('company')
            ->select('id', 'title', 'department', 'company_id')
            ->get()
            ->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->department,
                    'company' => $vacancy->company ? $vacancy->company->name : null
                ];
            });
            
        return Inertia::render('admin/periods/edit', [
            'period' => [
                'id' => $period->id,
                'name' => $period->name,
                'description' => $period->description,
                'vacancies_ids' => $period->vacancies->pluck('id'),
                'start_time' => $period->start_time,
                'end_time' => $period->end_time,
            ],
            'vacancies' => $vacancies
        ]);
    }

    public function update(Request $request, Period $period)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'vacancies_ids' => 'required|array',
            'vacancies_ids.*' => 'exists:vacancies,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        // Update period details
        $period->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);
        
        // Sync vacancies to this period
        $period->vacancies()->sync($validated['vacancies_ids']);

        // Get the period with its associated vacancies for the response
        $period->load('vacancies.company', 'vacancies.questionPack');
        
        // Get current date for status checking
        $now = Carbon::now();
        
        $periodData = [
            'id' => $period->id,
            'name' => $period->name,
            'description' => $period->description,
            'start_date' => Carbon::parse($period->start_time)->format('d/m/Y'),
            'end_date' => Carbon::parse($period->end_time)->format('d/m/Y'),
            'status' => $now->lt(Carbon::parse($period->start_time)) ? 'Upcoming' : 
                      ($now->gt(Carbon::parse($period->end_time)) ? 'Closed' : 'Open'),
            'vacancies' => $period->vacancies->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->department,
                ];
            })
        ];

        if ($request->ajax() || $request->expectsJson()) {
            return response()->json([
                'message' => 'Period updated successfully',
                'period' => $periodData
            ]);
        }

        return redirect()->route('admin.periods.index')
            ->with('success', 'Period updated successfully');
    }

    public function destroy(Request $request, Period $period)
    {
        // Delete all applicants related to this period first
        $vacancyPeriodIds = \App\Models\VacancyPeriod::where('period_id', $period->id)->pluck('id');
        Applicant::whereIn('vacancy_period_id', $vacancyPeriodIds)->delete();
        
        // Detach all vacancies from this period
        $period->vacancies()->detach();
        
        // Delete the period
        $period->delete();

        // Handle JSON/AJAX requests
        if ($request->ajax() || $request->expectsJson()) {
            return response()->json([
                'message' => 'Period deleted successfully',
                'success' => true
            ]);
        }

        return redirect()->route('admin.periods.index')
            ->with('success', 'Period deleted successfully');
    }
    
    /**
     * Show companies for a specific period.
     */
    public function company(Request $request)
    {
        $periodId = $request->query('periodId');
        $period = Period::with('vacancies.company')->findOrFail($periodId);
        
        // Get unique companies from the vacancies in this period
        $companies = $period->vacancies->map(function ($vacancy) {
            return $vacancy->company;
        })->unique('id')->values()->map(function ($company) use ($period) {
            return [
                'id' => $company->id,
                'name' => $company->name,
                // Count applicants for this company in this period
                'applicants_count' => Applicant::whereHas('vacancyPeriod', function($query) use ($period) {
                        $query->where('period_id', $period->id);
                    })
                    ->whereHas('vacancyPeriod.vacancy', function ($query) use ($company) {
                        $query->where('company_id', $company->id);
                    })
                    ->count()
            ];
        });
        
        return Inertia::render('admin/periods/company', [
            'periodId' => $periodId,
            'periodName' => $period->name,
            'companies' => $companies
        ]);
    }

    /**
     * Show the administration page for a specific company, filtered by period.
     */
    public function administration(Request $request, $companyId)
    {
        $selectedPeriodId = $request->query('periodId');
        $company = Company::findOrFail($companyId);
        $period = null;
        
        if ($selectedPeriodId) {
            $period = Period::find($selectedPeriodId);
        }
        
        // Get applicants for this company and period
        $applicantsQuery = Applicant::with(['user', 'vacancyPeriod.vacancy', 'vacancyPeriod.period', 'status'])
            ->whereHas('vacancyPeriod.vacancy', function ($query) use ($companyId) {
                $query->where('company_id', $companyId);
            });
            
        if ($selectedPeriodId) {
            $applicantsQuery->whereHas('vacancyPeriod', function ($query) use ($selectedPeriodId) {
                $query->where('period_id', $selectedPeriodId);
            });
        }
        
        $applicants = $applicantsQuery->get()
            ->map(function ($applicant) {
                return [
                    'id' => (string)$applicant->id,
                    'name' => $applicant->user->name,
                    'email' => $applicant->user->email,
                    'position' => $applicant->vacancy->title ?? 'Unknown',
                    'status' => $applicant->status->name ?? 'Pending',
                    'registration_date' => $applicant->applied_at->format('M d, Y'),
                    'period' => $applicant->period->name ?? 'Unknown',
                    'periodId' => (string)$applicant->period_id,
                    'application_data' => $applicant->application_data,
                    'test_results' => $applicant->test_results,
                ];
            });
        
        // Get all periods available for this company
        $periods = Period::whereHas('vacancies', function($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })->get()->map(function($period) {
            return [
                'id' => $period->id,
                'name' => $period->name
            ];
        });
        
        return Inertia::render('admin/company/administration', [
            'applicants' => $applicants,
            'companyName' => $company->name,
            'companyId' => $companyId,
            'periods' => $periods,
            'selectedPeriodId' => $selectedPeriodId,
            'periodName' => $period ? $period->name : null,
        ]);
    }
}
