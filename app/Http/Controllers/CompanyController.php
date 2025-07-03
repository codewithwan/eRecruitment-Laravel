<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Period;
use App\Models\Vacancies;
use App\Models\Application;
use App\Models\ApplicationReport;
use App\Models\Status;
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
        $companyId = $request->query('company');
        $periodId = $request->query('period');
        
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
                'registration_date' => $application->created_at->format('M d, Y'),
                'cv' => [
                    'filename' => $application->user->name . '_cv.pdf',
                    'fileType' => 'pdf',
                    'url' => '/uploads/cv/' . $application->user->name . '_cv.pdf'
                ],
                'periodId' => $period ? (string)$period->id : '1',
                'vacancy' => $vacancy ? $vacancy->title : 'Unknown',
                'admin_score' => $administration ? $administration->score : null,
                'admin_status' => $administration && isset($administration->status) ? $administration->status : 'pending',
                'admin_notes' => $administration ? $administration->notes : null,
                'documents_checked' => $administration && isset($administration->documents_checked) ? $administration->documents_checked : null,
                'requirements_met' => $administration && isset($administration->requirements_met) ? $administration->requirements_met : null,
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
        $companyId = $request->query('company');
        $periodId = $request->query('period');
        
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
        // Only get applications that have passed administration or have assessment data
        ->where(function($query) {
            $query->whereHas('administration', function($adminQuery) {
                $adminQuery->whereHas('status', function($q) {
                    $q->where('code', 'passed');
                });
            })
            ->orWhereHas('assessment');
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
                'registration_date' => $application->created_at->format('M d, Y'),
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
        $companyId = $request->query('company');
        $periodId = $request->query('period');
        
        // Get applications with interview data
        $applicationsQuery = Application::with([
            'user',
            'vacancyPeriod.vacancy.company',
            'vacancyPeriod.period',
            'interview.reviewer',
            'interview.status',
            'status'
        ])
        ->whereHas('vacancyPeriod.vacancy', function($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })
        // Only get applications that have passed assessment or have interview data
        ->where(function($query) {
            $query->whereHas('assessment', function($assessmentQuery) {
                $assessmentQuery->whereHas('status', function($q) {
                    $q->where('code', 'completed');
                });
            })
            ->orWhereHas('interview');
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
                'registration_date' => $application->created_at->format('M d, Y'),
                'status' => $interview && $interview->status ? $interview->status->name : 'scheduled',
                'interview_date' => $interview && $interview->scheduled_at ? $interview->scheduled_at->format('M d, Y') : null,
                'interview_time' => $interview && $interview->scheduled_at ? $interview->scheduled_at->format('h:i A') : null,
                'interviewer' => $interview && $interview->reviewer ? $interview->reviewer->name : null,
                'interview_type' => $interview && isset($interview->interview_type) ? $interview->interview_type : 'Technical Interview',
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
            'administration',
            'assessment',
            'interview',
            'status'
        ])
        ->whereHas('vacancyPeriod.vacancy', function($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })
        // Only get applications that have reports
        ->whereHas('report');
        
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
                'registration_date' => $application->created_at->format('M d, Y'),
                'period' => $period ? $period->name : 'Unknown',
                'overall_score' => $report ? $report->overall_score : null,
                'final_decision' => $report ? $report->final_decision : 'pending',
                'final_notes' => $report ? $report->final_notes : null,
                'rejection_reason' => $report ? $report->rejection_reason : null,
                'recommendation' => $report ? $report->recommendation : null,
                'decision_made_by' => $report && $report->decisionMaker ? $report->decisionMaker->name : null,
                'decision_made_at' => $report && $report->decision_made_at ? $report->decision_made_at->format('M d, Y H:i') : null,
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

    /**
     * Show interview detail page for a candidate.
     */
    public function interviewDetail($userId)
    {
        // Fetch application and related data from database
        $application = \App\Models\Application::with([
            'user',
            'vacancyPeriod.vacancy',
            'vacancyPeriod.period',
            'history.status',
        ])->findOrFail($userId);

        // Get interview history (status code: interview)
        $interview = $application->history()->whereHas('status', function($q) {
            $q->where('code', 'interview');
        })->first();

        $interviewData = [
            'id' => $application->id,
            'name' => $application->user->name,
            'email' => $application->user->email,
            'position' => $application->vacancyPeriod->vacancy->title ?? '-',
            'registration_date' => $application->created_at->format('Y-m-d'),
            'phone' => $application->user->phone ?? null,
            'cv_url' => '/uploads/cv/' . $application->user->name . '_cv.pdf',
            'interview_date' => $interview && $interview->scheduled_at ? $interview->scheduled_at->format('Y-m-d') : null,
            'interview_time' => $interview && $interview->scheduled_at ? $interview->scheduled_at->format('H:i') : null,
            'status' => $interview && $interview->status ? $interview->status->code : 'pending',
            'notes' => $interview ? $interview->notes : null,
            'skills' => $application->user->skills ? $application->user->skills->pluck('name')->toArray() : [],
            'experience_years' => $application->user->experience_years ?? 0,
            'education' => $application->user->education ?? null,
            'portfolio_url' => $application->user->portfolio_url ?? null,
            'score' => $interview ? $interview->score : null,
            'company_id' => $application->vacancyPeriod->vacancy->company_id ?? null,
            'period_id' => $application->vacancyPeriod->period_id ?? null,
        ];

        return Inertia::render('admin/company/interview-detail', [
            'userId' => $userId,
            'interviewData' => $interviewData,
        ]);
    }

    public function approveInterview(Request $request, $id)
    {
        $application = Application::findOrFail($id);
        
        // Update interview history
        $application->history()->updateOrCreate(
            ['status_id' => Status::where('code', 'interview')->first()->id],
            ['status_id' => Status::where('code', 'passed')->first()->id]
        );

        // Create or update application report
        ApplicationReport::updateOrCreate(
            ['application_id' => $application->id],
            [
                'final_decision' => 'accepted',
                'final_notes' => $request->input('notes', 'Candidate accepted.'),
                'overall_score' => $request->input('score', null),
                'decision_made_by' => auth()->id(),
                'decision_made_at' => now(),
            ]
        );

        // Update application status to accepted
        $application->status_id = Status::where('code', 'accepted')->first()->id;
        $application->save();

        $companyId = $application->vacancyPeriod->vacancy->company_id;
        $periodId = $application->vacancyPeriod->period_id;

        return redirect()->route('company.reports', ['company' => $companyId, 'period' => $periodId])
            ->with('success', 'Candidate has been accepted.');
    }

    public function rejectInterview(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        // Update interview history
        $application->history()->updateOrCreate(
            ['status_id' => Status::where('code', 'interview')->first()->id],
            ['status_id' => Status::where('code', 'failed')->first()->id]
        );

        // Create or update application report
        ApplicationReport::updateOrCreate(
            ['application_id' => $application->id],
            [
                'final_decision' => 'rejected',
                'final_notes' => $request->input('notes', 'Candidate rejected after interview.'),
                'decision_made_by' => auth()->id(),
                'decision_made_at' => now(),
            ]
        );

        // Update application status to rejected
        $application->status_id = Status::where('code', 'rejected')->first()->id;
        $application->save();

        $companyId = $application->vacancyPeriod->vacancy->company_id;
        $periodId = $application->vacancyPeriod->period_id;

        return redirect()->route('company.interview', ['company' => $companyId, 'period' => $periodId])
            ->with('success', 'Candidate has been rejected.');
    }
}
