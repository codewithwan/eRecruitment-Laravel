<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\ApplicationHistory;
use App\Models\Status;
use App\Models\UserAnswer;
use App\Models\Period;
use App\Models\User;
use App\Models\VacancyPeriods;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationStageController extends Controller
{
    private array $stageOrder = [
        'administrative_selection' => 1,
        'psychological_test' => 2,
        'interview' => 3
    ];

    /**
     * Display applications for a specific stage
     */
    public function index(Request $request, string $stage)
    {
        // Get the status for this stage
        $status = Status::where('stage', $stage)->first();
        if (!$status) {
            abort(404, 'Stage not found');
        }

        // Build the base query
        $query = Application::with([
            'user.candidatesProfile', // Basic candidate info
            'vacancyPeriod.vacancy.company', // Company info
            'vacancyPeriod.period', // Period info
            'history' => function ($query) use ($stage) {
                $query->with(['status', 'reviewer'])
                    ->whereHas('status', fn($q) => $q->where('stage', $stage))
                    ->where('is_active', true)
                    ->latest();
            }
        ]);

        // Filter by period if provided
        if ($request->has('period')) {
            $query->whereHas('vacancyPeriod', function ($q) use ($request) {
                $q->where('period_id', $request->period);
            });
        }

        // Filter by company if provided
        if ($request->has('company')) {
            $query->whereHas('vacancyPeriod.vacancy', function ($q) use ($request) {
                $q->where('company_id', $request->company);
            });
        }

        // Get applications that should be in this stage
        $query->whereHas('history', function ($q) use ($stage) {
            $q->whereHas('status', fn($sq) => $sq->where('stage', $stage))
                ->where('is_active', true);
        });

        // Add stage-specific relations and data
        switch ($stage) {
            case 'psychological_test':
                $query->with(['userAnswers.question.choices']);
                break;
            case 'interview':
                $query->with(['history' => function ($q) {
                    $q->where('stage', 'interview')
                        ->with(['reviewer:id,name,email']);
                }]);
                break;
        }

        // Get candidate details
        $query->with([
            'user' => function ($q) {
                $q->with([
                    'candidatesProfile',
                    'candidatesEducations' => function ($q) {
                        $q->with('educationLevel:id,name');
                    },
                    'candidatesSkills:id,user_id,skill_name',
                    'candidatesLanguages:id,user_id,language_name',
                    'candidatesCertifications',
                    'candidatesWorkExperiences',
                    'candidatesOrganizations',
                    'candidatesCV' => function ($q) {
                        $q->latest();
                    }
                ]);
            }
        ]);

        $applications = $query->paginate(10)
            ->through(function ($application) use ($stage) {
                $currentHistory = $application->history->first();
                $status = $currentHistory?->status;
                
                $baseData = [
                    'id' => $application->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                    'position' => $application->vacancyPeriod->vacancy->title,
                    'company' => $application->vacancyPeriod->vacancy->company->name,
                    'status' => $status ? $status->name : 'Pending',
                    'score' => $currentHistory?->score,
                    'scheduled_at' => $currentHistory?->scheduled_at,
                    'completed_at' => $currentHistory?->completed_at,
                    'notes' => $currentHistory?->notes,
                    'reviewed_by' => $currentHistory?->reviewer?->name,
                ];

                // Add candidate profile data
                if ($application->user->candidatesProfile) {
                    $baseData['candidate'] = [
                        'profile' => $application->user->candidatesProfile->toArray(),
                        'education' => $application->user->candidatesEducations->map(fn($edu) => [
                            'level' => $edu->educationLevel ? $edu->educationLevel->name : null,
                            'institution' => $edu->institution_name,
                            'faculty' => $edu->faculty,
                            'major' => $edu->major ? $edu->major->name : null,
                            'start_year' => $edu->year_in,
                            'end_year' => $edu->year_out,
                            'gpa' => $edu->gpa,
                        ])->toArray(),
                        'skills' => $application->user->candidatesSkills->pluck('skill_name')->toArray(),
                        'languages' => $application->user->candidatesLanguages->map(fn($lang) => [
                            'name' => $lang->language_name,
                            'level' => '', // Level is included in the language_name
                        ])->toArray(),
                        'certifications' => $application->user->candidatesCertifications->map(fn($cert) => [
                            'name' => $cert->name,
                            'issuer' => $cert->issuer,
                            'date' => $cert->date,
                        ])->toArray(),
                        'work_experiences' => $application->user->candidatesWorkExperiences->map(fn($exp) => [
                            'company' => $exp->company,
                            'position' => $exp->position,
                            'start_date' => $exp->start_date,
                            'end_date' => $exp->end_date,
                            'description' => $exp->description,
                        ])->toArray(),
                        'organizations' => $application->user->candidatesOrganizations->map(fn($org) => [
                            'name' => $org->name,
                            'position' => $org->position,
                            'start_year' => $org->start_year,
                            'end_year' => $org->end_year,
                        ])->toArray(),
                        'cv' => $application->user->candidatesCV?->path,
                    ];
                }

                // Add stage-specific data
                switch ($stage) {
                    case 'psychological_test':
                        if ($application->userAnswers->isNotEmpty()) {
                            $baseData['assessment'] = [
                                'answers' => $application->userAnswers->map(fn($answer) => [
                                    'question' => $answer->question->question_text,
                                    'answer' => $answer->choice->choice_text,
                                    'is_correct' => $answer->choice->is_correct,
                                    'score' => $answer->choice->is_correct ? 100 : 0,
                                    'choices' => $answer->question->choices->map(fn($choice) => [
                                        'text' => $choice->choice_text,
                                        'is_correct' => $choice->is_correct,
                                    ])->toArray(),
                                ])->toArray(),
                                'total_score' => $application->userAnswers->avg('score'),
                            ];
                        }
                        break;

                    case 'interview':
                        if ($currentHistory) {
                            $baseData['interview'] = [
                                'interviewer' => $currentHistory->reviewer ? [
                                    'name' => $currentHistory->reviewer->name,
                                    'email' => $currentHistory->reviewer->email,
                                ] : null,
                                'feedback' => $currentHistory->notes,
                                'score' => $currentHistory->score,
                            ];
                        }
                        break;
                }

                return $baseData;
            });

        // Get period and company info if filters are provided
        $periodInfo = null;
        $companyInfo = null;

        if ($request->has('period') || $request->has('company')) {
            // Get the vacancy period that matches our filters
            $vacancyPeriodQuery = VacancyPeriods::query()
                ->with(['vacancy.company', 'period']);

            if ($request->has('period')) {
                $vacancyPeriodQuery->where('period_id', $request->query('period'));
            }

            if ($request->has('company')) {
                $vacancyPeriodQuery->whereHas('vacancy', function($q) use ($request) {
                    $q->where('company_id', $request->query('company'));
                });
            }

            $vacancyPeriod = $vacancyPeriodQuery->first();

            if ($vacancyPeriod) {
                if ($request->has('period')) {
                    $periodInfo = [
                        'name' => $vacancyPeriod->period->name,
                        'start_date' => $vacancyPeriod->period->start_time,
                        'end_date' => $vacancyPeriod->period->end_time,
                    ];
                }

                if ($request->has('company')) {
                    $companyInfo = [
                        'name' => $vacancyPeriod->vacancy->company->name,
                    ];
                }
            }

            // Log the info we found
            logger('Found VacancyPeriod Info:', [
                'vacancy_period' => $vacancyPeriod ? [
                    'id' => $vacancyPeriod->id,
                    'vacancy_id' => $vacancyPeriod->vacancy_id,
                    'period_id' => $vacancyPeriod->period_id,
                    'period_name' => $vacancyPeriod->period->name ?? null,
                    'company_name' => $vacancyPeriod->vacancy->company->name ?? null,
                ] : null
            ]);
        }

        // Map stage to page name
        $pageMap = [
            'administrative_selection' => 'administration',
            'psychological_test' => 'assessment',
            'interview' => 'interview'
        ];

        $pageName = $pageMap[$stage] ?? 'administration';

        return Inertia::render("admin/company/{$pageName}", [
            'applications' => $applications,
            'period' => $periodInfo,
            'company' => $companyInfo,
            'filters' => $request->only(['search', 'status']),
            'stage' => [
                'current' => $stage,
                'name' => $status->name,
                'description' => $status->description,
            ],
        ]);
    }

    /**
     * Update application stage status
     */
    public function update(Request $request, Application $application, string $stage)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'notes' => 'nullable|string',
            'score' => 'nullable|numeric|min:0|max:100',
            'scheduled_at' => 'nullable|date',
            'interviewer_id' => 'nullable|exists:users,id',
        ]);

        // Get the status for this stage
        $status = Status::where('stage', $stage)
            ->where('code', $validated['status'])
            ->firstOrFail();

        // Mark previous history for this stage as inactive
        $application->history()
            ->where('is_active', true)
            ->whereHas('status', function ($query) use ($stage) {
                $query->where('stage', $stage);
            })
            ->update(['is_active' => false]);

        // Create new history
        $history = $application->history()->create([
            'status_id' => $status->id,
            'notes' => $validated['notes'] ?? null,
            'score' => $validated['score'] ?? null,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
            'processed_at' => now(),
            'reviewed_by' => $validated['interviewer_id'] ?? Auth::id(),
            'reviewed_at' => now(),
            'is_active' => true,
        ]);

        // Handle stage-specific logic
        switch ($stage) {
            case 'psychological_test':
                if ($validated['status'] === 'completed' && isset($validated['answers'])) {
                    foreach ($validated['answers'] as $answer) {
                        UserAnswer::updateOrCreate(
                            [
                                'user_id' => $application->user_id,
                                'question_id' => $answer['question_id'],
                            ],
                            [
                                'answer' => $answer['answer'],
                                'score' => $answer['score'],
                            ]
                        );
                    }
                }
                break;

            case 'interview':
                if ($validated['status'] === 'scheduled' && isset($validated['interviewer_id'])) {
                    // Additional interview scheduling logic if needed
                }
                break;
        }

        // If status is passed/completed, create initial history for next stage
        if (in_array($validated['status'], ['passed', 'completed'])) {
            $nextStage = $this->getNextStage($stage);
            if ($nextStage) {
                $nextStatus = Status::where('stage', $nextStage)
                    ->where('code', 'pending')
                    ->first();

                if ($nextStatus) {
                    $application->history()->create([
                        'status_id' => $nextStatus->id,
                        'processed_at' => now(),
                        'is_active' => true,
                    ]);
                }
            }
        }

        // If status is failed/rejected, update application status
        if (in_array($validated['status'], ['failed', 'rejected'])) {
            $rejectedStatus = Status::where('code', 'rejected')->first();
            if ($rejectedStatus) {
                $application->update(['status_id' => $rejectedStatus->id]);
            }
        }

        return back()->with('success', 'Application updated successfully');
    }

    /**
     * Get the next stage in the recruitment process
     */
    private function getNextStage(string $currentStage): ?string
    {
        $currentOrder = $this->stageOrder[$currentStage] ?? null;
        if (!$currentOrder) return null;

        $nextOrder = $currentOrder + 1;
        return array_search($nextOrder, $this->stageOrder);
    }

    public function administration(Request $request): Response
    {
        // Get the administration status
        $administrationStatus = Status::where('code', 'admin_selection')
            ->where('stage', 'administrative_selection')
            ->first();
        
        logger('Administration Status:', ['status' => $administrationStatus]);
        
        if (!$administrationStatus) {
            return Inertia::render('admin/company/administration', [
                'candidates' => [
                    'data' => [],
                    'current_page' => 1,
                    'per_page' => 10,
                    'last_page' => 1,
                    'total' => 0,
                ],
                'message' => 'Administration status not found'
            ]);
        }

        // Build the base query
        $query = Application::with([
            'user:id,name,email',
            'vacancyPeriod' => function($query) {
                $query->select('id', 'vacancy_id', 'period_id')
                    ->with(['vacancy:id,title,company_id', 'period:id,name,start_time,end_time']);
            }
        ])
        ->where('status_id', $administrationStatus->id);

        // Log initial query count
        logger('Initial Query Count:', [
            'count' => $query->count(),
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings()
        ]);

        // Filter by company if provided
        if ($request->has('company')) {
            $companyId = $request->query('company');
            logger('Filtering by company:', ['company_id' => $companyId]);
            $query->whereHas('vacancyPeriod.vacancy', function($q) use ($companyId) {
                $q->where('company_id', $companyId);
            });
            
            // Log count after company filter
            logger('After Company Filter Count:', [
                'count' => $query->count()
            ]);
        }

        // Filter by period if provided
        if ($request->has('period')) {
            $periodId = $request->query('period');
            logger('Filtering by period:', ['period_id' => $periodId]);
            $query->whereHas('vacancyPeriod', function($q) use ($periodId) {
                $q->where('period_id', $periodId);
            });
            
            // Log count after period filter
            logger('After Period Filter Count:', [
                'count' => $query->count()
            ]);
        }

        // Get paginated results
        $applications = $query->orderBy('created_at', 'desc')->paginate(50)->withQueryString();
        
        // Debug log for raw data count
        logger('Final Applications Count:', [
            'total' => $applications->total(),
            'current_page' => $applications->currentPage(),
            'per_page' => $applications->perPage(),
            'last_page' => $applications->lastPage(),
            'items_in_current_page' => count($applications->items())
        ]);

        // Transform the data to include position
        $transformedData = collect($applications->items())->map(function ($application) {
            $data = [
                'id' => $application->id,
                'user' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                ],
                'vacancy_period' => [
                    'vacancy' => [
                        'title' => $application->vacancyPeriod->vacancy->title ?? 'N/A'
                    ]
                ],
                'created_at' => $application->created_at,
            ];
            logger('Transformed Item:', $data);
            return $data;
        })->all();

        logger('Total Transformed Items:', ['count' => count($transformedData)]);

        // Get period and company info if filters are provided
        $periodInfo = null;
        $companyInfo = null;

        if ($request->has('period') || $request->has('company')) {
            // Get the vacancy period that matches our filters
            $vacancyPeriodQuery = VacancyPeriods::query()
                ->with(['vacancy.company', 'period']);

            if ($request->has('period')) {
                $vacancyPeriodQuery->where('period_id', $request->query('period'));
            }

            if ($request->has('company')) {
                $vacancyPeriodQuery->whereHas('vacancy', function($q) use ($request) {
                    $q->where('company_id', $request->query('company'));
                });
            }

            $vacancyPeriod = $vacancyPeriodQuery->first();

            if ($vacancyPeriod) {
                if ($request->has('period')) {
                    $periodInfo = [
                        'name' => $vacancyPeriod->period->name,
                        'start_date' => $vacancyPeriod->period->start_time,
                        'end_date' => $vacancyPeriod->period->end_time,
                    ];
                }

                if ($request->has('company')) {
                    $companyInfo = [
                        'name' => $vacancyPeriod->vacancy->company->name,
                    ];
                }
            }

            // Log the info we found
            logger('Found VacancyPeriod Info:', [
                'vacancy_period' => $vacancyPeriod ? [
                    'id' => $vacancyPeriod->id,
                    'vacancy_id' => $vacancyPeriod->vacancy_id,
                    'period_id' => $vacancyPeriod->period_id,
                    'period_name' => $vacancyPeriod->period->name ?? null,
                    'company_name' => $vacancyPeriod->vacancy->company->name ?? null,
                ] : null
            ]);
        }

        return Inertia::render('admin/company/administration', [
            'candidates' => [
                'data' => $transformedData,
                'current_page' => $applications->currentPage(),
                'per_page' => $applications->perPage(),
                'last_page' => $applications->lastPage(),
                'total' => $applications->total(),
                'links' => $applications->linkCollection()->toArray()
            ],
            'filters' => [
                'company' => $request->query('company'),
                'period' => $request->query('period'),
            ],
            'periodInfo' => $periodInfo ? [
                'name' => $periodInfo['name'],
                'start_date' => $periodInfo['start_date'],
                'end_date' => $periodInfo['end_date'],
            ] : null,
            'companyInfo' => $companyInfo ? [
                'name' => $companyInfo['name'],
            ] : null,
        ]);
    }

    public function administrationDetail($id): Response
    {
        $application = Application::with([
            'user.candidatesProfile',
            'user.candidatesEducations.educationLevel',
            'user.candidatesWorkExperiences',
            'user.candidatesSkills',
            'user.candidatesLanguages',
            'user.candidatesCourses',
            'user.candidatesCertifications',
            'user.candidatesOrganizations',
            'user.candidatesAchievements',
            'user.candidatesSocialMedia',
            'user.candidatesCV',
            'vacancyPeriod.vacancy.company',
            'vacancyPeriod.period',
            'status',
            'history' => function($query) {
                $query->with(['status', 'reviewer'])->latest();
            }
        ])->findOrFail($id);

        $profile = $application->user->candidatesProfile;
        $profileData = $profile ? [
            'full_name' => $profile->full_name,
            'phone' => $profile->phone,
            'address' => $profile->address,
            'birth_place' => $profile->birth_place,
            'birth_date' => $profile->birth_date,
            'gender' => $profile->gender,
        ] : null;

        return Inertia::render('admin/company/administration-detail', [
            'candidate' => [
                'id' => $application->id,
                'user' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                    'profile' => $profileData,
                    'education' => $application->user->candidatesEducations->map(fn($edu) => [
                        'level' => $edu->educationLevel ? $edu->educationLevel->name : null,
                        'institution' => $edu->institution_name,
                        'faculty' => $edu->faculty,
                        'major' => $edu->major ? $edu->major->name : null,
                        'start_year' => $edu->year_in,
                        'end_year' => $edu->year_out,
                        'gpa' => $edu->gpa,
                    ]),
                    'work_experiences' => $application->user->candidatesWorkExperiences->map(fn($exp) => [
                        'company' => $exp->company,
                        'position' => $exp->position,
                        'start_date' => $exp->start_date,
                        'end_date' => $exp->end_date,
                        'description' => $exp->description,
                    ]),
                    'skills' => $application->user->candidatesSkills->map(fn($skill) => [
                        'name' => $skill->skill_name,
                        'level' => $skill->proficiency_level,
                    ]),
                    'languages' => $application->user->candidatesLanguages->map(fn($lang) => [
                        'name' => $lang->language_name,
                        'proficiency' => $lang->proficiency_level,
                    ]),
                    'courses' => $application->user->candidatesCourses->map(fn($course) => [
                        'name' => $course->name,
                        'institution' => $course->institution,
                        'completion_date' => $course->completion_date,
                        'description' => $course->description,
                    ]),
                    'certifications' => $application->user->candidatesCertifications->map(fn($cert) => [
                        'name' => $cert->name,
                        'issuer' => $cert->issuer,
                        'date' => $cert->date,
                        'expiry_date' => $cert->expiry_date,
                        'credential_id' => $cert->credential_id,
                    ]),
                    'organizations' => $application->user->candidatesOrganizations->map(fn($org) => [
                        'name' => $org->name,
                        'position' => $org->position,
                        'start_year' => $org->start_year,
                        'end_year' => $org->end_year,
                        'description' => $org->description,
                    ]),
                    'achievements' => $application->user->candidatesAchievements->map(fn($achievement) => [
                        'title' => $achievement->title,
                        'issuer' => $achievement->issuer,
                        'date' => $achievement->date,
                        'description' => $achievement->description,
                    ]),
                    'social_media' => $application->user->candidatesSocialMedia->map(fn($social) => [
                        'platform' => $social->platform,
                        'url' => $social->url,
                    ]),
                    'cv' => $application->user->candidatesCV ? [
                        'path' => $application->user->candidatesCV->path,
                        'uploaded_at' => $application->user->candidatesCV->created_at,
                    ] : null,
                ],
                'vacancy' => [
                    'id' => $application->vacancyPeriod->vacancy->id,
                    'title' => $application->vacancyPeriod->vacancy->title,
                    'company' => [
                        'id' => $application->vacancyPeriod->vacancy->company->id,
                        'name' => $application->vacancyPeriod->vacancy->company->name,
                    ],
                    'period' => [
                        'id' => $application->vacancyPeriod->period->id,
                        'name' => $application->vacancyPeriod->period->name,
                        'start_time' => $application->vacancyPeriod->period->start_time,
                        'end_time' => $application->vacancyPeriod->period->end_time,
                    ],
                ],
                'status' => [
                    'id' => $application->status->id,
                    'name' => $application->status->name,
                    'code' => $application->status->code,
                ],
                'history' => $application->history->map(fn($history) => [
                    'id' => $history->id,
                    'status' => [
                        'name' => $history->status->name,
                        'code' => $history->status->code,
                    ],
                    'notes' => $history->notes,
                    'score' => $history->score,
                    'processed_at' => $history->processed_at,
                    'scheduled_at' => $history->scheduled_at,
                    'completed_at' => $history->completed_at,
                    'reviewer' => $history->reviewer ? [
                        'id' => $history->reviewer->id,
                        'name' => $history->reviewer->name,
                        'email' => $history->reviewer->email,
                    ] : null,
                ]),
                'applied_at' => $application->created_at,
            ]
        ]);
    }

    public function assessment(Request $request): Response
    {
        // Get the assessment status
        $assessmentStatus = Status::where('code', 'psychotest')
            ->where('stage', 'psychological_test')
            ->first();
        
        logger('Assessment Status:', ['status' => $assessmentStatus]);
        
        if (!$assessmentStatus) {
            return Inertia::render('admin/company/assessment', [
                'candidates' => [
                    'data' => [],
                    'current_page' => 1,
                    'per_page' => 10,
                    'last_page' => 1,
                    'total' => 0,
                ],
                'message' => 'Assessment status not found',
                'filters' => [
                    'company' => $request->query('company'),
                    'period' => $request->query('period'),
                ],
            ]);
        }

        // Build the base query
        $query = Application::with([
            'user:id,name,email',
            'vacancyPeriod' => function($query) {
                $query->select('id', 'vacancy_id', 'period_id')
                    ->with(['vacancy:id,title,company_id', 'period:id,name,start_time,end_time']);
            },
            'userAnswers' => function($query) {
                $query->with([
                    'question:id,question_text',
                    'choice:id,choice_text,is_correct'
                ]);
            },
            'history' => function($query) use ($assessmentStatus) {
                $query->where('status_id', $assessmentStatus->id)
                    ->where('is_active', true)
                    ->with(['status', 'reviewer'])
                    ->latest();
            }
        ])
        ->whereHas('history', function($query) use ($assessmentStatus) {
            $query->where('status_id', $assessmentStatus->id)
                ->where('is_active', true);
        });

        // Filter by company if provided
        if ($request->has('company')) {
            $companyId = $request->query('company');
            logger('Filtering by company:', ['company_id' => $companyId]);
            $query->whereHas('vacancyPeriod.vacancy', function($q) use ($companyId) {
                $q->where('company_id', $companyId);
            });
        }

        // Filter by period if provided
        if ($request->has('period')) {
            $periodId = $request->query('period');
            logger('Filtering by period:', ['period_id' => $periodId]);
            $query->whereHas('vacancyPeriod', function($q) use ($periodId) {
                $q->where('period_id', $periodId);
            });
        }

        // Get paginated results
        $applications = $query->orderBy('created_at', 'desc')->paginate(50)->withQueryString();

        // Transform the data
        $transformedData = collect($applications->items())->map(function ($application) {
            $currentHistory = $application->history->first();
            return [
                'id' => $application->id,
                'user' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                ],
                'vacancy_period' => [
                    'vacancy' => [
                        'title' => $application->vacancyPeriod->vacancy->title ?? 'N/A'
                    ]
                ],
                'created_at' => $application->created_at,
                'stages' => [
                    'psychological_test' => [
                        'status' => $currentHistory?->status->code ?? 'pending',
                        'score' => $currentHistory?->score,
                        'completed_at' => $currentHistory?->completed_at,
                        'notes' => $currentHistory?->notes,
                        'reviewed_by' => $currentHistory?->reviewer?->name,
                    ]
                ],
                'assessment' => [
                    'answers' => $application->userAnswers->map(fn($answer) => [
                        'question' => $answer->question->question_text,
                        'answer' => $answer->choice->choice_text,
                        'is_correct' => $answer->choice->is_correct,
                        'score' => $answer->choice->is_correct ? 100 : 0,
                    ])->toArray(),
                    'total_score' => $application->userAnswers->avg(function($answer) {
                        return $answer->choice->is_correct ? 100 : 0;
                    }),
                ]
            ];
        })->all();

        // Get period and company info
        $periodInfo = null;
        $companyInfo = null;

        if ($request->has('period') || $request->has('company')) {
            $vacancyPeriodQuery = VacancyPeriods::query()
                ->with(['vacancy.company', 'period']);

            if ($request->has('period')) {
                $vacancyPeriodQuery->where('period_id', $request->query('period'));
            }

            if ($request->has('company')) {
                $vacancyPeriodQuery->whereHas('vacancy', function($q) use ($request) {
                    $q->where('company_id', $request->query('company'));
                });
            }

            $vacancyPeriod = $vacancyPeriodQuery->first();

            if ($vacancyPeriod) {
                if ($request->has('period')) {
                    $periodInfo = [
                        'name' => $vacancyPeriod->period->name,
                        'start_date' => $vacancyPeriod->period->start_time,
                        'end_date' => $vacancyPeriod->period->end_time,
                    ];
                }

                if ($request->has('company')) {
                    $companyInfo = [
                        'name' => $vacancyPeriod->vacancy->company->name,
                    ];
                }
            }
        }

        return Inertia::render('admin/company/assessment', [
            'candidates' => [
                'data' => $transformedData,
                'current_page' => $applications->currentPage(),
                'per_page' => $applications->perPage(),
                'last_page' => $applications->lastPage(),
                'total' => $applications->total(),
                'links' => $applications->linkCollection()->toArray()
            ],
            'filters' => [
                'company' => $request->query('company'),
                'period' => $request->query('period'),
            ],
            'periodInfo' => $periodInfo,
            'companyInfo' => $companyInfo,
            'stage' => [
                'current' => 'psychological_test',
                'name' => $assessmentStatus->name,
                'description' => $assessmentStatus->description,
            ],
        ]);
    }

    public function interview(Request $request): Response
    {
        // Get the interview status
        $interviewStatus = Status::where('code', 'interview')
            ->where('stage', 'interview')
            ->first();
        
        logger('Interview Status:', ['status' => $interviewStatus]);
        
        if (!$interviewStatus) {
            return Inertia::render('admin/company/interview', [
                'candidates' => [
                    'data' => [],
                    'current_page' => 1,
                    'per_page' => 10,
                    'last_page' => 1,
                    'total' => 0,
                ],
                'message' => 'Interview status not found',
                'filters' => [
                    'company' => $request->query('company'),
                    'period' => $request->query('period'),
                ],
            ]);
        }

        // Build the base query
        $query = Application::with([
            'user:id,name,email',
            'vacancyPeriod' => function($query) {
                $query->select('id', 'vacancy_id', 'period_id')
                    ->with(['vacancy:id,title,company_id', 'period:id,name,start_time,end_time']);
            },
            'history' => function($query) use ($interviewStatus) {
                $query->where('status_id', $interviewStatus->id)
                    ->where('is_active', true)
                    ->with(['status', 'reviewer'])
                    ->latest();
            }
        ])
        ->whereHas('history', function($query) use ($interviewStatus) {
            $query->where('status_id', $interviewStatus->id)
                ->where('is_active', true);
        });

        // Filter by company if provided
        if ($request->has('company')) {
            $companyId = $request->query('company');
            logger('Filtering by company:', ['company_id' => $companyId]);
            $query->whereHas('vacancyPeriod.vacancy', function($q) use ($companyId) {
                $q->where('company_id', $companyId);
            });
        }

        // Filter by period if provided
        if ($request->has('period')) {
            $periodId = $request->query('period');
            logger('Filtering by period:', ['period_id' => $periodId]);
            $query->whereHas('vacancyPeriod', function($q) use ($periodId) {
                $q->where('period_id', $periodId);
            });
        }

        // Get paginated results
        $applications = $query->orderBy('created_at', 'desc')->paginate(50)->withQueryString();

        // Transform the data
        $transformedData = collect($applications->items())->map(function ($application) {
            $currentHistory = $application->history->first();
            return [
                'id' => $application->id,
                'user' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                ],
                'vacancy_period' => [
                    'vacancy' => [
                        'title' => $application->vacancyPeriod->vacancy->title ?? 'N/A'
                    ]
                ],
                'created_at' => $application->created_at,
                'stages' => [
                    'interview' => [
                        'status' => $currentHistory?->status->code ?? 'pending',
                        'scheduled_at' => $currentHistory?->scheduled_at,
                        'completed_at' => $currentHistory?->completed_at,
                        'notes' => $currentHistory?->notes,
                        'score' => $currentHistory?->score,
                        'interviewer' => $currentHistory?->reviewer ? [
                            'name' => $currentHistory->reviewer->name,
                            'email' => $currentHistory->reviewer->email,
                        ] : null,
                    ]
                ]
            ];
        })->all();

        // Get period and company info
        $periodInfo = null;
        $companyInfo = null;

        if ($request->has('period') || $request->has('company')) {
            $vacancyPeriodQuery = VacancyPeriods::query()
                ->with(['vacancy.company', 'period']);

            if ($request->has('period')) {
                $vacancyPeriodQuery->where('period_id', $request->query('period'));
            }

            if ($request->has('company')) {
                $vacancyPeriodQuery->whereHas('vacancy', function($q) use ($request) {
                    $q->where('company_id', $request->query('company'));
                });
            }

            $vacancyPeriod = $vacancyPeriodQuery->first();

            if ($vacancyPeriod) {
                if ($request->has('period')) {
                    $periodInfo = [
                        'name' => $vacancyPeriod->period->name,
                        'start_date' => $vacancyPeriod->period->start_time,
                        'end_date' => $vacancyPeriod->period->end_time,
                    ];
                }

                if ($request->has('company')) {
                    $companyInfo = [
                        'name' => $vacancyPeriod->vacancy->company->name,
                    ];
                }
            }
        }

        return Inertia::render('admin/company/interview', [
            'candidates' => [
                'data' => $transformedData,
                'current_page' => $applications->currentPage(),
                'per_page' => $applications->perPage(),
                'last_page' => $applications->lastPage(),
                'total' => $applications->total(),
                'links' => $applications->linkCollection()->toArray()
            ],
            'filters' => [
                'company' => $request->query('company'),
                'period' => $request->query('period'),
            ],
            'periodInfo' => $periodInfo,
            'companyInfo' => $companyInfo,
            'stage' => [
                'current' => 'interview',
                'name' => $interviewStatus->name,
                'description' => $interviewStatus->description,
            ],
        ]);
    }
} 