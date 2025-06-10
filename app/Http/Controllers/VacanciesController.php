<?php

namespace App\Http\Controllers;

use App\Models\Vacancies;
use App\Models\Companies;
use App\Models\CandidatesProfiles;
use App\Models\CandidatesEducations;
use App\Models\CandidatesWorkExperiences;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VacanciesController extends Controller
{
    public function index()
    {
        try {
            // Query vacancies with relationships
            $vacancies = Vacancies::with(['company', 'jobType', 'department'])
                ->orderBy('created_at', 'desc')
                ->take(6) // Limit to 6 jobs for the welcome page
                ->get()
                ->map(function ($vacancy) {
                    return [
                        'id' => $vacancy->id,
                        'title' => $vacancy->title,
                        'company' => [
                            'name' => $vacancy->company ? $vacancy->company->name : 'N/A',
                        ],
                        'description' => $vacancy->job_description ?? $vacancy->description,
                        'location' => $vacancy->location,
                        'type' => $vacancy->jobType ? $vacancy->jobType->name : 'N/A',
                        'deadline' => $vacancy->deadline ? $vacancy->deadline->format('d F Y') : 'Open',
                        'department' => $vacancy->department ? $vacancy->department->name : 'N/A',
                    ];
                });

            return Inertia::render('welcome', [
                'vacancies' => $vacancies,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in VacanciesController@index: ' . $e->getMessage());
            return Inertia::render('welcome', [
                'vacancies' => [],
                'error' => 'Failed to load job vacancies',
            ]);
        }
    }

    public function store()
    {
        $vacancies = Vacancies::all();
        Log::info($vacancies);

        return Inertia::render('admin/jobs/jobs-management', [
            'vacancies' => $vacancies,
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'requirements' => 'required|array',
            'benefits' => 'nullable|array',
        ]);

        $user_id = Auth::user()->id;
        $job = Vacancies::create([
            'user_id' => $user_id,
            'title' => $validated['title'],
            'department' => $validated['department'],
            'location' => $validated['location'],
            'requirements' => $validated['requirements'],
            'benefits' => $validated['benefits'] ?? [],
        ]);

        return response()->json([
            'message' => 'Job created successfully',
            'job' => $job,
        ], 201);
    }

    public function update(Request $request, Vacancies $job)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'requirements' => 'required|array',
            'benefits' => 'nullable|array',
        ]);

        $job->update([
            'title' => $validated['title'],
            'department' => $validated['department'],
            'location' => $validated['location'],
            'requirements' => $validated['requirements'],
            'benefits' => $validated['benefits'] ?? [],
        ]);

        return response()->json([
            'message' => 'Job updated successfully',
            'job' => $job,
        ]);
    }

    public function destroy(Vacancies $job)
    {
        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully',
        ]);
    }

    public function getVacancies(Request $request)
    {
        $userId = Auth::id();

        // Ambil data kandidat
        $profile = CandidatesProfiles::where('user_id', $userId)->first();
        $education = CandidatesEducations::where('user_id', $userId)->first();
        $workExperiences = CandidatesWorkExperiences::where('user_id', $userId)->get();

        // Ambil jurusan kandidat
        $majorId = $education?->major_id;

        // Ambil semua lowongan
        $vacancies = Vacancies::with(['company', 'jobType', 'department'])->get()->map(function ($vacancy) {
            return [
                'id' => $vacancy->id,
                'title' => $vacancy->title,
                'company' => [
                    'name' => $vacancy->company ? $vacancy->company->name : 'N/A',
                ],
                'description' => $vacancy->job_description ?? $vacancy->description,
                'location' => $vacancy->location,
                'type' => $vacancy->jobType ? $vacancy->jobType->name : 'N/A',
                'deadline' => $vacancy->deadline ? $vacancy->deadline->format('d F Y') : 'Open',
                'department' => $vacancy->department ? $vacancy->department->name : 'N/A',
                'requirements' => $vacancy->requirements,
            ];
        });

        // Rekomendasi berdasarkan jurusan kandidat
        $recommendations = [];
        if ($majorId) {
            $recommendedVacancies = Vacancies::with(['company', 'jobType', 'department'])
                ->where('major_id', $majorId)
                ->get();

            foreach ($recommendedVacancies as $vacancy) {
                $recommendations[] = [
                    'vacancy' => [
                        'id' => $vacancy->id,
                        'title' => $vacancy->title,
                        'company' => [
                            'name' => $vacancy->company ? $vacancy->company->name : 'N/A',
                        ],
                        'description' => $vacancy->job_description ?? $vacancy->description,
                        'location' => $vacancy->location,
                        'type' => $vacancy->jobType ? $vacancy->jobType->name : 'N/A',
                        'deadline' => $vacancy->deadline ? $vacancy->deadline->format('d F Y') : 'Open',
                        'department' => $vacancy->department ? $vacancy->department->name : 'N/A',
                    ],
                    'score' => 100, // Atau logika penilaian lain jika ingin
                ];
            }
        }

        $companies = Companies::pluck('name')->toArray();

        // Ambil nama jurusan kandidat untuk frontend
        $candidateMajor = $education && $education->major ? $education->major->name : null;

        return Inertia::render('candidate/jobs/job-hiring', [
            'jobs' => $vacancies,
            'recommendations' => $recommendations,
            'companies' => $companies,
            'candidateMajor' => $candidateMajor,
        ]);
    }

    public function getVacanciesLandingPage(Request $request)
    {
        try {
            // Query vacancies with relationships
            $query = Vacancies::with(['company', 'jobType', 'department'])
                ->orderBy('created_at', 'desc');

            // Filter by company if provided
            if ($request->has('company') && $request->company !== 'all') {
                $query->whereHas('company', function ($q) use ($request) {
                    $q->where('name', $request->company);
                });
            }

            // Map vacancies data
            $vacancies = $query->get()->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'company' => [
                        'name' => $vacancy->company ? $vacancy->company->name : 'N/A',
                    ],
                    'description' => $vacancy->job_description ?? $vacancy->description,
                    'location' => $vacancy->location,
                    'type' => $vacancy->jobType ? $vacancy->jobType->name : 'N/A',
                    'deadline' => $vacancy->deadline ? $vacancy->deadline->format('d F Y') : 'Open',
                    'department' => $vacancy->department ? $vacancy->department->name : 'N/A',
                ];
            });

            // Get list of companies for filtering
            $companies = Companies::pluck('name');

            // Render the view with data
            return Inertia::render('landing-page/job-hiring-landing-page', [
                'jobs' => $vacancies,
                'companies' => $companies,
            ]);
        } catch (\Exception $e) {
            // Log error and return empty data with error message
            Log::error('Error in VacanciesController@getVacancies: ' . $e->getMessage());
            return Inertia::render('landing-page/job-hiring-landing-page', [
                'jobs' => [],
                'companies' => [],
                'error' => 'Failed to load job vacancies',
            ]);
        }
    }

    public function show($id)
    {
        $job = Vacancies::with('company')->findOrFail($id);

        return Inertia::render('candidate/detail-job/detail-job', [
            'job' => [
                'title' => $job->title,
                'company' => [
                    'name' => $job->company->name,
                ],
                'job_description' => $job->job_description,
                'requirements' => $job->requirements,
                'benefits' => $job->benefits,
            ],
        ]);
    }
}
