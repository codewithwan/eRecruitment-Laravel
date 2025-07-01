<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Period;
use App\Models\Vacancies;
use App\Models\Application;
use App\Models\VacancyPeriods;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CompanyController extends Controller
{
    /**
     * Show administration page for a company.
     */
    public function administration(Request $request)
    {
        $companyId = $request->query('companyId', 1);
        $periodId = $request->query('period');
        
        // If periodId is provided, use it to get the correct company
        if ($periodId) {
            $period = Period::with('company')->find($periodId);
            if ($period && $period->company) {
                $companyId = $period->company->id;
            }
        }
        
        $company = Company::findOrFail($companyId);
        
        // Get applications with administration data
        $applicationsQuery = Application::with([
            'user',
            'vacancyPeriod.vacancy.company',
            'vacancyPeriod.period',
            'administration',
            'status'
        ])
        ->whereHas('vacancyPeriod.vacancy', function($query) use ($companyId) {
            $query->where('company_id', $companyId);
        });
        
        // Filter by period if specified
        if ($periodId) {
            $applicationsQuery->whereHas('vacancyPeriod', function($query) use ($periodId) {
                $query->where('period_id', $periodId);
            });
        }
        
        $applications = $applicationsQuery->get();
        
        // Format data for frontend
        $candidates = $applications->map(function ($application) {
            $vacancy = $application->vacancyPeriod->vacancy ?? null;
            $period = $application->vacancyPeriod->period ?? null;
            $administration = $application->administration;
            
            return [
                'id' => (string)$application->id,
                'name' => $application->user->name,
                'email' => $application->user->email,
                'position' => $vacancy ? $vacancy->title : 'Unknown',
                'period' => $period ? $period->name : 'Unknown',
                'registration_date' => $application->applied_at->format('M d, Y'),
                'cv' => [
                    'filename' => $application->user->name . '_cv.pdf',
                    'fileType' => 'pdf',
                    'url' => '/uploads/cv/' . $application->user->name . '_cv.pdf'
                ],
                'periodId' => $period ? (string)$period->id : '1',
                'vacancy' => $vacancy ? $vacancy->title : 'Unknown',
                'admin_score' => $administration ? $administration->score : null,
                'admin_status' => $administration ? $administration->status : 'pending',
                'admin_notes' => $administration ? $administration->notes : null,
                'documents_checked' => $administration ? $administration->documents_checked : null,
                'requirements_met' => $administration ? $administration->requirements_met : null,
                'reviewed_by' => $administration && $administration->reviewer ? $administration->reviewer->name : null,
                'reviewed_at' => $administration && $administration->reviewed_at ? $administration->reviewed_at->format('M d, Y H:i') : null,
            ];
        });
        
        return Inertia::render('admin/company/administration', [
            'company' => $company,
            'candidates' => $candidates,
            'users' => $candidates, // For compatibility with existing component
            'pagination' => [
                'total' => $candidates->count(),
                'per_page' => 10,
                'current_page' => 1,
                'last_page' => 1,
            ]
        ]);
    }

    /**
     * Show assessment page for a company.
     */
    public function assessment(Request $request)
    {
        $companyId = $request->query('companyId', 1);
        $periodId = $request->query('period');
        
        // If periodId is provided, use it to get the correct company
        if ($periodId) {
            $period = Period::with('company')->find($periodId);
            if ($period && $period->company) {
                $companyId = $period->company->id;
            }
        }
        
        // Get applications with assessment data
        $applicationsQuery = Application::with([
            'user',
            'vacancyPeriod.vacancy.company',
            'vacancyPeriod.period',
            'assessment',
            'status'
        ])
        ->whereHas('vacancyPeriod.vacancy', function($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })
        // Only get applications that have passed administration or are in assessment stage
        ->where(function($query) {
            $query->whereHas('administration', function($adminQuery) {
                $adminQuery->where('status', 'passed');
            })
            ->orWhere('current_stage', 'assessment');
        });
        
        // Filter by period if specified
        if ($periodId) {
            $applicationsQuery->whereHas('vacancyPeriod', function($query) use ($periodId) {
                $query->where('period_id', $periodId);
            });
        }
        
        $applications = $applicationsQuery->get();
        
        // Format data for frontend
        $assessments = $applications->map(function ($application) {
            $vacancy = $application->vacancyPeriod->vacancy ?? null;
            $period = $application->vacancyPeriod->period ?? null;
            $assessment = $application->assessment;
            
            return [
                'id' => (string)$application->id,
                'name' => $application->user->name,
                'email' => $application->user->email,
                'position' => $vacancy ? $vacancy->title : 'Unknown',
                'period' => $period ? $period->name : 'Unknown',
                'periodId' => $period ? (string)$period->id : '1',
                'vacancy' => $vacancy ? $vacancy->title : 'Unknown',
                'registration_date' => $application->applied_at->format('M d, Y'),
                'test_date' => $assessment && $assessment->scheduled_at ? $assessment->scheduled_at->format('M d, Y') : null,
                'test_time' => $assessment && $assessment->scheduled_at ? $assessment->scheduled_at->format('h:i A') : null,
                'status' => $assessment ? $assessment->status : 'scheduled',
                'score' => $assessment ? $assessment->score : null,
                'test_type' => $assessment ? $assessment->test_type : null,
                'test_results' => $assessment ? $assessment->test_results : null,
                'notes' => $assessment ? $assessment->notes : null,
                'test_location' => $assessment ? $assessment->test_location : null,
                'attendance_confirmed' => $assessment ? $assessment->attendance_confirmed : false,
                'started_at' => $assessment && $assessment->started_at ? $assessment->started_at->format('M d, Y H:i') : null,
                'completed_at' => $assessment && $assessment->completed_at ? $assessment->completed_at->format('M d, Y H:i') : null,
            ];
        });
        
        return Inertia::render('admin/company/assessment', [
            'assessments' => $assessments,
            'users' => $assessments, // For compatibility
            'pagination' => [
                'total' => $assessments->count(),
                'per_page' => 10,
                'current_page' => 1,
                'last_page' => 1,
            ]
        ]);
    }

    /**
     * Show interview page for a company.
     */
    public function interview(Request $request)
    {
        $companyId = $request->query('companyId', 1);
        $periodId = $request->query('period');
        
        // If periodId is provided, use it to get the correct company
        if ($periodId) {
            $period = Period::with('company')->find($periodId);
            if ($period && $period->company) {
                $companyId = $period->company->id;
            }
        }
        
        // Get applications with interview data
        $applicationsQuery = Application::with([
            'user',
            'vacancyPeriod.vacancy.company',
            'vacancyPeriod.period',
            'interview.interviewer',
            'interview.scheduler',
            'status'
        ])
        ->whereHas('vacancyPeriod.vacancy', function($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })
        // Only get applications that have passed assessment or are in interview stage
        ->where(function($query) {
            $query->whereHas('assessment', function($assessmentQuery) {
                $assessmentQuery->where('status', 'completed');
            })
            ->orWhere('current_stage', 'interview');
        });
        
        // Filter by period if specified
        if ($periodId) {
            $applicationsQuery->whereHas('vacancyPeriod', function($query) use ($periodId) {
                $query->where('period_id', $periodId);
            });
        }
        
        $applications = $applicationsQuery->get();
        
        // Format data for frontend
        $interviews = $applications->map(function ($application) {
            $vacancy = $application->vacancyPeriod->vacancy ?? null;
            $period = $application->vacancyPeriod->period ?? null;
            $interview = $application->interview;
            
            return [
                'id' => (string)$application->id,
                'name' => $application->user->name,
                'email' => $application->user->email,
                'position' => $vacancy ? $vacancy->title : 'Unknown',
                'period' => $period ? $period->name : 'Unknown',
                'registration_date' => $application->applied_at->format('M d, Y'),
                'status' => $interview ? $interview->status : 'scheduled',
                'interview_date' => $interview && $interview->scheduled_at ? $interview->scheduled_at->format('M d, Y') : null,
                'interview_time' => $interview && $interview->scheduled_at ? $interview->scheduled_at->format('h:i A') : null,
                'interviewer' => $interview && $interview->interviewer ? $interview->interviewer->name : null,
                'interview_type' => $interview ? $interview->interview_type : 'Technical Interview',
                'score' => $interview ? $interview->score : null,
                'notes' => $interview ? $interview->notes : null,
                'feedback' => $interview ? $interview->feedback : null,
                'evaluation_criteria' => $interview ? $interview->evaluation_criteria : null,
                'is_online' => $interview ? $interview->is_online : true,
                'location' => $interview ? $interview->location : null,
                'attendance_confirmed' => $interview ? $interview->attendance_confirmed : false,
                'started_at' => $interview && $interview->started_at ? $interview->started_at->format('M d, Y H:i') : null,
                'completed_at' => $interview && $interview->completed_at ? $interview->completed_at->format('M d, Y H:i') : null,
            ];
        });
        
        return Inertia::render('admin/company/interview', [
            'interviews' => $interviews,
            'users' => $interviews, // For compatibility
            'pagination' => [
                'total' => $interviews->count(),
                'per_page' => 10,
                'current_page' => 1,
                'last_page' => 1,
            ]
        ]);
    }

    /**
     * Show reports page for a company.
     */
    public function reports(Request $request)
    {
        $companyId = $request->query('companyId', 1);
        $periodId = $request->query('period');
        
        // If periodId is provided, use it to get the correct company
        if ($periodId) {
            $period = Period::with('company')->find($periodId);
            if ($period && $period->company) {
                $companyId = $period->company->id;
            }
        }
        
        // Get applications with report data
        $applicationsQuery = Application::with([
            'user',
            'vacancyPeriod.vacancy.company',
            'vacancyPeriod.period',
            'report.decisionMaker',
            'report.reportGenerator',
            'administration',
            'assessment',
            'interview',
            'status'
        ])
        ->whereHas('vacancyPeriod.vacancy', function($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })
        // Only get applications that have completed all stages or have reports
        ->where(function($query) {
            $query->whereHas('report')
            ->orWhere('current_stage', 'completed');
        });
        
        // Filter by period if specified
        if ($periodId) {
            $applicationsQuery->whereHas('vacancyPeriod', function($query) use ($periodId) {
                $query->where('period_id', $periodId);
            });
        }
        
        $applications = $applicationsQuery->get();
        
        // Format data for frontend
        $reports = $applications->map(function ($application) {
            $vacancy = $application->vacancyPeriod->vacancy ?? null;
            $period = $application->vacancyPeriod->period ?? null;
            $report = $application->report;
            $administration = $application->administration;
            $assessment = $application->assessment;
            $interview = $application->interview;
            
            return [
                'id' => (string)$application->id,
                'name' => $application->user->name,
                'email' => $application->user->email,
                'position' => $vacancy ? $vacancy->title : 'Unknown',
                'registration_date' => $application->applied_at->format('M d, Y'),
                'period' => $period ? $period->name : 'Unknown',
                'overall_score' => $report ? $report->overall_score : null,
                'final_decision' => $report ? $report->final_decision : 'pending',
                'final_notes' => $report ? $report->final_notes : null,
                'rejection_reason' => $report ? $report->rejection_reason : null,
                'recommendation' => $report ? $report->recommendation : null,
                'decision_made_by' => $report && $report->decisionMaker ? $report->decisionMaker->name : null,
                'decision_made_at' => $report && $report->decision_made_at ? $report->decision_made_at->format('M d, Y H:i') : null,
                'report_generated_by' => $report && $report->reportGenerator ? $report->reportGenerator->name : null,
                'report_generated_at' => $report && $report->report_generated_at ? $report->report_generated_at->format('M d, Y H:i') : null,
                'administration_score' => $administration ? $administration->score : null,
                'assessment_score' => $assessment ? $assessment->score : null,
                'interview_score' => $interview ? $interview->score : null,
                'stage_summary' => $report ? $report->stage_summary : null,
                'strengths' => $report ? $report->strengths : null,
                'weaknesses' => $report ? $report->weaknesses : null,
                'next_steps' => $report ? $report->next_steps : null,
            ];
        });
        
        // Calculate real statistics from the data
        $totalReports = $reports->count();
        $completedReports = $reports->filter(function ($report) {
            return in_array($report['final_decision'], ['accepted', 'rejected']);
        })->count();
        $inProgressReports = $reports->filter(function ($report) {
            return $report['final_decision'] === 'pending' && $report['overall_score'] !== null;
        })->count();
        $pendingReports = $reports->filter(function ($report) {
            return $report['final_decision'] === 'pending' && $report['overall_score'] === null;
        })->count();

        return Inertia::render('admin/company/reports', [
            'reports' => $reports,
            'users' => $reports, // For compatibility
            'statistics' => [
                'total' => $totalReports,
                'completed' => $completedReports,
                'scheduled' => $inProgressReports,
                'waiting' => $pendingReports,
            ],
            'pagination' => [
                'total' => $reports->count(),
                'per_page' => 10,
                'current_page' => 1,
                'last_page' => 1,
            ]
        ]);
    }

    public function index()
    {
        $companies = Company::all();
        
        return Inertia::render('admin/companies/index', [
            'companies' => $companies
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/companies/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        Company::create($request->all());

        return redirect()->route('company-management.index')
            ->with('success', 'Company created successfully.');
    }

    public function show(Company $company)
    {
        return Inertia::render('admin/companies/show', [
            'company' => $company
        ]);
    }

    public function edit(Company $company)
    {
        return Inertia::render('admin/companies/edit', [
            'company' => $company
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $company->update($request->all());

        return redirect()->route('company-management.index')
            ->with('success', 'Company updated successfully.');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('company-management.index')
            ->with('success', 'Company deleted successfully.');
    }

    public function periods(Company $company)
    {
        // Debug: Log the received company
        Log::info('Company received: ' . $company->name . ' (ID: ' . $company->id . ')');
        
        // Get real periods associated with this company through vacancies
        $periodsQuery = Period::with([
            'vacancies.company', 
            'vacancies.questionPack',
            'vacancies.departement'
        ])
        ->whereHas('vacancies', function ($query) use ($company) {
            $query->where('company_id', $company->id);
        });
        
        $periods = $periodsQuery->get();
        
        // Get current date for status checking
        $now = \Carbon\Carbon::now();
        
        // Format the data for the frontend
        $periodsData = $periods->map(function ($period) use ($company, $now) {
            // Calculate status based on current date
            $status = 'Not Set';
            if ($period->start_time && $period->end_time) {
                $startTime = \Carbon\Carbon::parse($period->start_time);
                $endTime = \Carbon\Carbon::parse($period->end_time);
                
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
                'start_date' => $period->start_time ? \Carbon\Carbon::parse($period->start_time)->format('d/m/Y') : null,
                'end_date' => $period->end_time ? \Carbon\Carbon::parse($period->end_time)->format('d/m/Y') : null,
                'status' => $status,
                'applicants_count' => $applicantsCount,
                'vacancies_list' => $companyVacancies->map(function ($vacancy) {
                    return [
                        'id' => $vacancy->id,
                        'title' => $vacancy->title,
                        'department' => $vacancy->departement ? $vacancy->departement->name : 'Unknown',
                    ];
                })->toArray(),
                'title' => $companyVacancies->first() ? $companyVacancies->first()->title : null,
                'department' => $companyVacancies->first() && $companyVacancies->first()->departement ? $companyVacancies->first()->departement->name : null,
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
        $vacancies = Vacancies::where('company_id', $company->id)
            ->with('departement')
            ->select('id', 'title', 'department_id')
            ->get()
            ->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->departement ? $vacancy->departement->name : 'Unknown',
                ];
            });
        
        return Inertia::render('admin/periods/index', [
            'periods' => $periodsData->toArray(),
            'pagination' => [
                'total' => $periodsData->count(),
                'per_page' => 10,
                'current_page' => 1,
                'last_page' => 1,
            ],
            'company' => [
                'id' => (int) $company->id,
                'name' => $company->name,
            ],
            'vacancies' => $vacancies,
            'filtering' => true,
        ]);
    }
}
