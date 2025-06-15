<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Period;
use App\Models\Vacancies;
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
        $company = Company::findOrFail($companyId);
        
        // Dummy data based on both screenshots - with period information from Periods page
        // and following the structure of the Assessment page
        $candidates = [
            [
                'id' => '01',
                'name' => 'Rizal Farhan Nanda',
                'email' => 'rizalfarhannanda@gmail.com',
                'position' => 'UI / UX',
                'period' => 'Q1 2025 Recruitment',  // From periods page
                'registration_date' => 'Mar 20, 2025',
            ],
            [
                'id' => '02',
                'name' => 'M. Hassan Naufal Zayyan',
                'email' => 'hassan@example.com',
                'position' => 'Back End',
                'period' => 'Q1 2025 Recruitment',
                'registration_date' => 'Mar 18, 2025',
            ],
            [
                'id' => '03',
                'name' => 'Ardan Ferdiansah',
                'email' => 'ardan@example.com',
                'position' => 'Front End',
                'period' => 'Q2 2025 Recruitment',
                'registration_date' => 'Mar 18, 2025',
            ],
            [
                'id' => '04',
                'name' => 'Muhammad Ridwan',
                'email' => 'ridwan@example.com',
                'position' => 'UX Writer',
                'period' => 'Q3 2025 Recruitment',
                'registration_date' => 'Mar 20, 2025',
            ],
            [
                'id' => '05',
                'name' => 'Untara Eka Saputra',
                'email' => 'untara@example.com',
                'position' => 'IT Spesialis',
                'period' => 'Q4 2025 Recruitment',
                'registration_date' => 'Mar 22, 2025',
            ],
            [
                'id' => '06',
                'name' => 'Dea Derika Winahyu',
                'email' => 'dea@example.com',
                'position' => 'UX Writer',
                'period' => 'Special Recruitment',
                'registration_date' => 'Mar 20, 2025',
            ],
            [
                'id' => '07',
                'name' => 'Kartika Yuliana',
                'email' => 'kartika@example.com',
                'position' => 'IT Spesialis',
                'period' => 'Q4 2025 Recruitment',
                'registration_date' => 'Mar 22, 2025',
            ],
        ];
        
        return Inertia::render('admin/company/administration', [
            'company' => $company,
            'candidates' => $candidates,
            'users' => $candidates, // For compatibility with existing component
            'pagination' => [
                'total' => count($candidates),
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
        
        // Assessment dummy data
        $assessments = [
            [
                'id' => '01',
                'name' => 'Rizal Farhan Nanda',
                'email' => 'rizalfarhannanda@gmail.com',
                'position' => 'UI / UX',
                'period' => 'Q1 2025 Recruitment',
                'test_date' => 'Mar 25, 2025',
                'test_time' => '09:00 AM',
                'status' => 'completed'
            ],
            [
                'id' => '02',
                'name' => 'M. Hassan Naufal Zayyan',
                'email' => 'hassan@example.com',
                'position' => 'Back End',
                'period' => 'Q1 2025 Recruitment',
                'test_date' => 'Mar 25, 2025',
                'test_time' => '10:00 AM',
                'status' => 'pending'
            ],
            [
                'id' => '03',
                'name' => 'Ardan Ferdiansah',
                'email' => 'ardan@example.com',
                'position' => 'Front End',
                'period' => 'Q2 2025 Recruitment',
                'test_date' => 'Mar 26, 2025',
                'test_time' => '09:00 AM',
                'status' => 'scheduled'
            ],
        ];
        
        return Inertia::render('admin/company/assessment', [
            'assessments' => $assessments,
            'users' => $assessments, // For compatibility
            'pagination' => [
                'total' => count($assessments),
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
        
        // Interview dummy data
        $interviews = [
            [
                'id' => '01',
                'name' => 'Rizal Farhan Nanda',
                'email' => 'rizalfarhannanda@gmail.com',
                'position' => 'UI / UX',
                'period' => 'Q1 2025 Recruitment',
                'interview_date' => 'Mar 30, 2025',
                'interview_time' => '10:00 AM',
                'interviewer' => 'John Doe',
                'status' => 'scheduled',
                'type' => 'Technical Interview'
            ],
            [
                'id' => '02',
                'name' => 'M. Hassan Naufal Zayyan',
                'email' => 'hassan@example.com',
                'position' => 'Back End',
                'period' => 'Q1 2025 Recruitment',
                'interview_date' => 'Mar 30, 2025',
                'interview_time' => '11:00 AM',
                'interviewer' => 'Jane Smith',
                'status' => 'completed',
                'type' => 'HR Interview'
            ],
            [
                'id' => '03',
                'name' => 'Ardan Ferdiansah',
                'email' => 'ardan@example.com',
                'position' => 'Front End',
                'period' => 'Q2 2025 Recruitment',
                'interview_date' => 'Apr 01, 2025',
                'interview_time' => '09:00 AM',
                'interviewer' => 'Mike Johnson',
                'status' => 'pending',
                'type' => 'Technical Interview'
            ],
        ];
        
        return Inertia::render('admin/company/interview', [
            'interviews' => $interviews,
            'users' => $interviews, // For compatibility
            'pagination' => [
                'total' => count($interviews),
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
        
        // Reports dummy data
        $reportsData = [
            'total_applications' => 245,
            'completed_assessments' => 189,
            'scheduled_interviews' => 67,
            'hired_candidates' => 23,
            'pending_reviews' => 34,
            
            'recent_activities' => [
                [
                    'id' => 1,
                    'activity' => 'New application received',
                    'candidate' => 'Rizal Farhan Nanda',
                    'position' => 'UI / UX',
                    'date' => '2025-03-20',
                    'time' => '10:30 AM'
                ],
                [
                    'id' => 2,
                    'activity' => 'Assessment completed',
                    'candidate' => 'M. Hassan Naufal Zayyan',
                    'position' => 'Back End',
                    'date' => '2025-03-19',
                    'time' => '02:15 PM'
                ],
                [
                    'id' => 3,
                    'activity' => 'Interview scheduled',
                    'candidate' => 'Ardan Ferdiansah',
                    'position' => 'Front End',
                    'date' => '2025-03-18',
                    'time' => '11:45 AM'
                ],
            ],
            
            'monthly_stats' => [
                'january' => ['applications' => 45, 'hired' => 8],
                'february' => ['applications' => 52, 'hired' => 12],
                'march' => ['applications' => 67, 'hired' => 15],
            ]
        ];
        
        return Inertia::render('admin/company/reports', [
            'reportsData' => $reportsData,
            'companyId' => $companyId
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
        
        // Ambil periods yang terkait dengan company ini
        // Jika belum ada relasi periods dengan company, gunakan dummy data
        $periods = collect([
            [
                'id' => 1,
                'name' => 'Q1 2025 Recruitment',
                'description' => 'First quarter recruitment for ' . $company->name,
                'start_date' => '2025-01-01',
                'end_date' => '2025-03-31',
                'status' => 'Active',
                'applicants_count' => 15,
                'vacancies_list' => [
                    ['id' => 1, 'title' => 'Frontend Developer', 'department' => 'Engineering'],
                    ['id' => 2, 'title' => 'Backend Developer', 'department' => 'Engineering']
                ]
            ],
            [
                'id' => 2,
                'name' => 'Q2 2025 Recruitment',
                'description' => 'Second quarter recruitment for ' . $company->name,
                'start_date' => '2025-04-01',
                'end_date' => '2025-06-30',
                'status' => 'Scheduled',
                'applicants_count' => 8,
                'vacancies_list' => [
                    ['id' => 3, 'title' => 'UI/UX Designer', 'department' => 'Design'],
                    ['id' => 4, 'title' => 'Product Manager', 'department' => 'Product']
                ]
            ]
        ]);
        
        // Get available vacancies for this company
        $vacancies = Vacancies::where('company_id', $company->id)->get();
        
        return Inertia::render('admin/periods/index', [
            'periods' => $periods->toArray(),
            'pagination' => [
                'total' => $periods->count(),
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
