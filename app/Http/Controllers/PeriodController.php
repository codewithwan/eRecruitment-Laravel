<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Models\Company;
use App\Models\Vacancies;
use App\Models\Application;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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
        $periodsQuery = Period::with([
            'vacancies.company', 
            'vacancies.questionPack',
            'vacancies.department',
            'applications.user',
            'applications.vacancyPeriod'
        ]);
        
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
        $periodsData = $periods->map(function ($period) use ($now, $companyId) {
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
            
            // Include all vacancy positions and departments, not just the first one
            if ($period->vacancies->isNotEmpty()) {
                // Filter vacancies by company if specified
                $relevantVacancies = $companyId 
                    ? $period->vacancies->where('company_id', $companyId)
                    : $period->vacancies;
                
                if ($relevantVacancies->isNotEmpty()) {
                    // Still include the first vacancy for backward compatibility
                    $firstVacancy = $relevantVacancies->first();
                    $data['title'] = $firstVacancy->title ?? null;
                    $data['department'] = $firstVacancy->department ? $firstVacancy->department->name : null;
                    $data['question_pack'] = $firstVacancy->questionPack ? $firstVacancy->questionPack->pack_name : null;
                    
                    // Add all vacancies as a separate array with company information
                    $data['vacancies_list'] = $relevantVacancies->map(function ($vacancy) {
                        return [
                            'id' => $vacancy->id,
                            'title' => $vacancy->title,
                            'department' => $vacancy->department ? $vacancy->department->name : 'Unknown',
                            'company' => $vacancy->company ? [
                                'id' => $vacancy->company->id,
                                'name' => $vacancy->company->name
                            ] : null
                        ];
                    })->toArray();
                    
                    // Add unique companies for this period
                    $data['companies'] = $relevantVacancies->pluck('company')->filter()->unique('id')->map(function ($company) {
                        return [
                            'id' => $company->id,
                            'name' => $company->name
                        ];
                    })->values()->toArray();
                    
                    // Count applicants for this period (filtered by company if specified)
                    if ($companyId) {
                        // Count applications for this period and company combination
                        $data['applicants_count'] = Application::whereHas('vacancyPeriod', function($query) use ($period) {
                            $query->where('period_id', $period->id);
                        })
                        ->whereHas('vacancyPeriod.vacancy', function($query) use ($companyId) {
                            $query->where('company_id', $companyId);
                        })->count();
                    } else {
                        // Count all applications for this period
                        $data['applicants_count'] = Application::whereHas('vacancyPeriod', function($query) use ($period) {
                            $query->where('period_id', $period->id);
                        })->count();
                    }
                } else {
                    // No relevant vacancies for this company
                    $data['title'] = null;
                    $data['department'] = null;
                    $data['question_pack'] = null;
                    $data['vacancies_list'] = [];
                    $data['companies'] = [];
                    $data['applicants_count'] = 0;
                }
            } else {
                $data['title'] = null;
                $data['department'] = null;
                $data['question_pack'] = null;
                $data['vacancies_list'] = [];
                $data['companies'] = [];
                $data['applicants_count'] = 0;
            }
            
            return $data;
        });

        // Get available vacancies for the period dropdown
        $vacancies = Vacancies::with('department')
            ->select('id', 'title', 'department_id')
            ->when($companyId, function($query) use ($companyId) {
                return $query->where('company_id', $companyId);
            })
            ->get()
            ->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->department ? $vacancy->department->name : 'Unknown',
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
        $vacancies = Vacancies::with(['company', 'department'])
            ->select('id', 'title', 'department_id', 'company_id')
            ->get()
            ->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->department ? $vacancy->department->name : 'Unknown',
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

        try {
        // Create new period
        $period = Period::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);
        
        // Attach vacancies to this period
        $period->vacancies()->attach($validated['vacancies_ids']);
        
            return redirect()->back()->with('success', 'Period created successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create period')
                ->withErrors(['error' => 'An error occurred while creating the period']);
        }
    }

    public function show(Period $period)
    {
        $period->load('vacancies.company', 'vacancies.department', 'applications.user', 'applications.vacancy', 'applications.status');
        
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
        
        $applicantsData = $period->applications->map(function ($applicant) {
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
                        'department' => $vacancy->department ? $vacancy->department->name : 'Unknown',
                        'company' => $vacancy->company ? $vacancy->company->name : null,
                    ];
                }),
                'applicants_count' => $period->applications->count(),
            ],
            'applicants' => $applicantsData
        ]);
    }

    public function edit(Period $period)
    {
        $period->load(['vacancies.company', 'vacancies.department']);
        
        $periodData = [
            'id' => $period->id,
            'name' => $period->name,
            'description' => $period->description,
            'start_time' => $period->start_time,
            'end_time' => $period->end_time,
            'vacancies_ids' => $period->vacancies->pluck('id')->map(fn($id) => (string)$id)->toArray()
        ];

        // Get the company ID from the first vacancy
        $companyId = $period->vacancies->first()->company->id ?? null;
        $company = $companyId ? Company::find($companyId) : null;

        // Get real periods associated with this company through vacancies
        $periodsQuery = Period::with([
            'vacancies.company', 
            'vacancies.questionPack',
            'vacancies.department'
        ])
        ->whereHas('vacancies', function ($query) use ($companyId) {
            $query->where('company_id', $companyId);
        });
        
        $periods = $periodsQuery->get();
        
        // Get current date for status checking
        $now = Carbon::now();
        
        // Format the data for the frontend
        $periodsData = $periods->map(function ($period) use ($company, $now) {
            // Calculate status based on current date
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
            
            // Get vacancies for this company in this period
            $companyVacancies = $period->vacancies->where('company_id', $company->id);
            
            // Count applications for this company in this period
            $applicantsCount = Application::whereHas('vacancyPeriod', function($query) use ($period) {
                $query->where('period_id', $period->id);
            })
            ->whereHas('vacancyPeriod.vacancy', function($query) use ($company) {
                $query->where('company_id', $company->id);
            })->count();
            
            return [
                'id' => $period->id,
                'name' => $period->name,
                'description' => $period->description,
                'start_date' => $period->start_time ? Carbon::parse($period->start_time)->format('d/m/Y') : null,
                'end_date' => $period->end_time ? Carbon::parse($period->end_time)->format('d/m/Y') : null,
                'status' => $status,
                'applicants_count' => $applicantsCount,
                'vacancies_list' => $companyVacancies->map(function ($vacancy) {
                    return [
                        'id' => $vacancy->id,
                        'title' => $vacancy->title,
                        'department' => $vacancy->department ? $vacancy->department->name : 'Unknown',
                    ];
                })->toArray(),
                'title' => $companyVacancies->first() ? $companyVacancies->first()->title : null,
                'department' => $companyVacancies->first() && $companyVacancies->first()->department ? $companyVacancies->first()->department->name : null,
                'question_pack' => $companyVacancies->first() && $companyVacancies->first()->questionPack ? $companyVacancies->first()->questionPack->pack_name : null,
                'companies' => [
                    [
                        'id' => $company->id,
                        'name' => $company->name
                    ]
                ]
            ];
        });

        // Get available vacancies for this company
        $vacancies = Vacancies::where('company_id', $companyId)
            ->with('department')
            ->select('id', 'title', 'department_id')
            ->get()
            ->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->department ? $vacancy->department->name : 'Unknown',
                ];
            });

        return Inertia::render('admin/periods/index', [
            'editingPeriod' => $periodData,
            'periods' => $periodsData->toArray(),
            'pagination' => [
                'total' => $periodsData->count(),
                'per_page' => 10,
                'current_page' => 1,
                'last_page' => 1,
            ],
            'company' => $company ? [
                'id' => (int) $company->id,
                'name' => $company->name,
            ] : null,
            'vacancies' => $vacancies,
            'filtering' => true,
        ]);
    }

    public function update(Request $request, Period $period)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'vacancies_ids' => 'required|array',
            'vacancies_ids.*' => 'exists:vacancies,id',
            'start_time' => 'required|date_format:Y-m-d',
            'end_time' => 'required|date_format:Y-m-d|after:start_time',
        ]);

        try {
            // Parse dates to ensure correct format
            $startTime = Carbon::parse($validated['start_time'])->startOfDay();
            $endTime = Carbon::parse($validated['end_time'])->endOfDay();

            $period->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'start_time' => $startTime,
                'end_time' => $endTime,
            ]);
            
            // Sync vacancies
            $period->vacancies()->sync($validated['vacancies_ids']);

            return response()->json([
                'success' => true,
                'message' => 'Period updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update period: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update period'
            ], 500);
        }
    }

    public function destroy(Period $period)
    {
        try {
        $period->delete();
            return redirect()->back()->with('success', 'Period deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete period')
                ->withErrors(['error' => 'An error occurred while deleting the period']);
        }
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
                'applicants_count' => Application::whereHas('vacancyPeriod', function($query) use ($period) {
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
        
        // Get applications with administration data for this company and period
        $applicantsQuery = Application::with([
            'user', 
            'vacancyPeriod.vacancy', 
            'vacancyPeriod.period', 
            'administration.reviewer',
            'status'
        ])
        ->whereHas('vacancyPeriod.vacancy', function ($query) use ($companyId) {
            $query->where('company_id', $companyId);
        });
            
        if ($selectedPeriodId) {
            $applicantsQuery->whereHas('vacancyPeriod', function ($query) use ($selectedPeriodId) {
                $query->where('period_id', $selectedPeriodId);
            });
        }
        
        $applicants = $applicantsQuery->get()
            ->map(function ($application) {
                $vacancy = $application->vacancyPeriod->vacancy ?? null;
                $period = $application->vacancyPeriod->period ?? null;
                $administration = $application->administration;
                
                return [
                    'id' => (string)$application->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                    'position' => $vacancy ? $vacancy->title : 'Unknown',
                    'status' => $application->status->name ?? 'Pending',
                    'registration_date' => $application->applied_at->format('M d, Y'),
                    'period' => $period ? $period->name : 'Unknown',
                    'periodId' => $period ? (string)$period->id : '1',
                    'admin_score' => $administration ? $administration->score : null,
                    'admin_status' => $administration ? $administration->status : 'pending',
                    'admin_notes' => $administration ? $administration->notes : null,
                    'documents_checked' => $administration ? $administration->documents_checked : null,
                    'requirements_met' => $administration ? $administration->requirements_met : null,
                    'reviewed_by' => $administration && $administration->reviewer ? $administration->reviewer->name : null,
                    'reviewed_at' => $administration && $administration->reviewed_at ? $administration->reviewed_at->format('M d, Y H:i') : null,
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

    /**
     * Get period details with company information by period ID.
     * This is used by the company pages to display the correct company and period info.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPeriodWithCompany(Request $request, $id)
    {
        try {
            // Find the period with its company and vacancies
            $period = Period::with(['company', 'vacancies.company'])->findOrFail($id);
            
            // Get company ID from query parameter if provided
            $requestedCompanyId = $request->query('company');
            
            // Log for debugging
            Log::info('getPeriodWithCompany called', [
                'period_id' => $id,
                'requested_company_id' => $requestedCompanyId,
                'period_name' => $period->name,
                'period_has_direct_company' => $period->company ? true : false,
                'vacancies_companies' => $period->vacancies->map(function($vacancy) {
                    return [
                        'vacancy_id' => $vacancy->id,
                        'vacancy_title' => $vacancy->title,
                        'company_id' => $vacancy->company ? $vacancy->company->id : null,
                        'company_name' => $vacancy->company ? $vacancy->company->name : null,
                    ];
                })->toArray()
            ]);
            
            $company = null;
            
            // If a specific company ID is requested, find that company
            if ($requestedCompanyId) {
                // Find the requested company among the period's vacancies
                $requestedCompany = $period->vacancies
                    ->pluck('company')
                    ->where('id', $requestedCompanyId)
                    ->first();
                
                if ($requestedCompany) {
                    $company = $requestedCompany;
                    Log::info('Found requested company', ['company_id' => $company->id, 'company_name' => $company->name]);
                } else {
                    Log::warning('Requested company not found in period vacancies', ['requested_company_id' => $requestedCompanyId]);
                }
            }
            
            // If no specific company requested or company not found, use fallback logic
            if (!$company) {
                // If period has a direct company relationship, use that
                if ($period->company) {
                    $company = $period->company;
                    Log::info('Using period direct company', ['company_id' => $company->id, 'company_name' => $company->name]);
                } 
                // Otherwise, try to get a company from the first vacancy
                else if ($period->vacancies->isNotEmpty() && $period->vacancies->first()->company) {
                    $company = $period->vacancies->first()->company;
                    Log::info('Using first vacancy company as fallback', ['company_id' => $company->id, 'company_name' => $company->name]);
                }
            }
            
            // Fallback if no company is found
            if (!$company) {
                return response()->json([
                    'success' => false,
                    'message' => 'No company found for this period',
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'period' => [
                        'id' => $period->id,
                        'name' => $period->name,
                        'start_date' => $period->start_time ? date('Y-m-d', strtotime($period->start_time)) : null,
                        'end_date' => $period->end_time ? date('Y-m-d', strtotime($period->end_time)) : null,
                    ],
                    'company' => [
                        'id' => $company->id,
                        'name' => $company->name,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Period not found or error fetching data',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
