<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Department;
use App\Models\EducationLevel;
use App\Models\MasterMajor;
use App\Models\QuestionPack;
use App\Models\Status;
use App\Models\User;
use App\Models\Vacancies;
use App\Models\VacancyType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class VacanciesController extends Controller
{
    public function index()
    {
        $vacancies = $this->getVacanciesWithStatus();

        return Inertia::render('welcome', [
            'vacancies' => $vacancies,
        ]);
    }

    public function store()
    {
        $vacancies = Vacancies::with([
            'company:id,name',
            'department:id,name',
            'major:id,name',
            'questionPack:id,pack_name,description,test_type,duration',
            'educationLevel:id,name',
            'vacancyType:id,name'
        ])->get();
        
        $companies = Company::all();
        $departments = Department::all();
        $majors = MasterMajor::orderBy('name')->get();
        $questionPacks = QuestionPack::select('id', 'pack_name', 'description', 'test_type', 'duration')->get();
        $educationLevels = EducationLevel::orderBy('name')->get();
        $vacancyTypes = VacancyType::select('id', 'name')->orderBy('name')->get();

        // Log data untuk debugging
        Log::info('Jobs Management Data:', [
            'vacancies_count' => $vacancies->count(),
            'companies_count' => $companies->count(),
            'departments_count' => $departments->count(),
            'majors_count' => $majors->count(),
            'questionPacks_count' => $questionPacks->count(),
            'educationLevels_count' => $educationLevels->count(),
            'vacancyTypes_count' => $vacancyTypes->count(),
        ]);

        return Inertia::render('admin/jobs/jobs-management', [
            'vacancies' => $vacancies->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department_id' => $vacancy->department_id,
                    'department' => $vacancy->department ? [
                        'id' => $vacancy->department->id,
                        'name' => $vacancy->department->name
                    ] : null,
                    'major_id' => $vacancy->major_id,
                    'major' => $vacancy->major ? [
                        'id' => $vacancy->major->id,
                        'name' => $vacancy->major->name
                    ] : null,
                    'location' => $vacancy->location,
                    'salary' => $vacancy->salary,
                    'company_id' => $vacancy->company_id,
                    'company' => $vacancy->company ? [
                        'id' => $vacancy->company->id,
                        'name' => $vacancy->company->name
                    ] : null,
                    'requirements' => is_array($vacancy->requirements) ? $vacancy->requirements : [],
                    'benefits' => is_array($vacancy->benefits) ? $vacancy->benefits : [],
                    'question_pack_id' => $vacancy->question_pack_id,
                    'questionPack' => $vacancy->questionPack ? [
                        'id' => $vacancy->questionPack->id,
                        'pack_name' => $vacancy->questionPack->pack_name,
                        'description' => $vacancy->questionPack->description,
                        'test_type' => $vacancy->questionPack->test_type,
                        'duration' => $vacancy->questionPack->duration
                    ] : null,
                    'education_level_id' => $vacancy->education_level_id,
                    'educationLevel' => $vacancy->educationLevel ? [
                        'id' => $vacancy->educationLevel->id,
                        'name' => $vacancy->educationLevel->name
                    ] : null,
                    'vacancy_type_id' => $vacancy->vacancy_type_id,
                    'vacancyType' => $vacancy->vacancyType ? [
                        'id' => $vacancy->vacancyType->id,
                        'name' => $vacancy->vacancyType->name
                    ] : null,
                    'job_description' => $vacancy->job_description,
                    'created_at' => $vacancy->created_at,
                    'updated_at' => $vacancy->updated_at
                ];
            }),
            'companies' => $companies,
            'departments' => $departments,
            'majors' => $majors,
            'questionPacks' => $questionPacks,
            'educationLevels' => $educationLevels,
            'vacancyTypes' => $vacancyTypes,
        ]);
    }

    public function create(Request $request)
    {
        // Log incoming request data
        Log::info('Job creation request data: ', $request->all());
        
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'department_id' => 'required|integer|exists:departments,id',
                'major_id' => 'nullable|integer|exists:master_majors,id',
                'location' => 'required|string|max:255',
                'salary' => 'nullable|string|max:255',
                'company_id' => 'required|integer|exists:companies,id',
                'requirements' => 'required|array|min:1',
                'requirements.*' => 'required|string',
                'benefits' => 'nullable|array',
                'benefits.*' => 'nullable|string',
                'question_pack_id' => 'nullable|integer|exists:question_packs,id',
                'education_level_id' => 'nullable|integer|exists:education_levels,id',
                'vacancy_type_id' => 'required|integer|exists:vacancy_types,id',
                'job_description' => 'nullable|string|max:1000',
            ]);
            
            Log::info('Validation passed, validated data: ', $validated);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Job creation validation failed: ', $e->errors());
            
            // Handle Inertia requests
            if ($request->header('X-Inertia')) {
                return back()->withErrors($e->errors())->withInput();
            }
            
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        try {
            $user_id = Auth::user()->id;
            
            // Prepare data for creation
            $createData = [
                'user_id' => $user_id,
                'title' => $validated['title'],
                'department_id' => $validated['department_id'],
                'major_id' => $validated['major_id'] ?? null,
                'location' => $validated['location'],
                'salary' => $validated['salary'] ?? null,
                'company_id' => $validated['company_id'],
                'requirements' => $validated['requirements'],
                'benefits' => !empty($validated['benefits']) ? $validated['benefits'] : null,
                'question_pack_id' => $validated['question_pack_id'] ?? null,
                'education_level_id' => $validated['education_level_id'] ?? null,
                'vacancy_type_id' => $validated['vacancy_type_id'],
                'job_description' => $validated['job_description'] ?? null,
            ];
            
            Log::info('Data to be created: ', $createData);
            
            $job = Vacancies::create($createData);

            // Load the relationships
            $job->load(['company', 'department', 'major', 'questionPack', 'educationLevel', 'vacancyType']);
            
            Log::info('Job created successfully with ID: ' . $job->id);
            
            // Handle Inertia requests
            if ($request->header('X-Inertia')) {
                return redirect()->route('admin.jobs.index')->with('success', 'Job created successfully');
            }
            
            return response()->json([
                'message' => 'Job created successfully',
                'job' => $job,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating job: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            // Handle Inertia requests
            if ($request->header('X-Inertia')) {
                return back()->withErrors(['error' => 'Error creating job: ' . $e->getMessage()])->withInput();
            }
            
            return response()->json([
                'message' => 'Error creating job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $job = Vacancies::findOrFail($id);
        
        // Log incoming request data for debugging
        Log::info('Job update request data: ', $request->all());
        Log::info('Current job data before update: ', $job->toArray());
        
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'department_id' => 'required|integer|exists:departments,id',
                'major_id' => 'nullable|integer|exists:master_majors,id',
                'location' => 'required|string|max:255',
                'salary' => 'nullable|string|max:255',
                'company_id' => 'required|integer|exists:companies,id',
                'requirements' => 'required|array|min:1',
                'requirements.*' => 'required|string',
                'benefits' => 'nullable|array',
                'benefits.*' => 'nullable|string',
                'question_pack_id' => 'nullable|integer|exists:question_packs,id',
                'education_level_id' => 'nullable|integer|exists:education_levels,id',
                'vacancy_type_id' => 'required|integer|exists:vacancy_types,id',
                'job_description' => 'nullable|string|max:1000',
            ]);
            
            Log::info('Validation passed, validated data: ', $validated);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Job update validation failed: ', $e->errors());
            
            // Handle Inertia requests
            if ($request->header('X-Inertia')) {
                return back()->withErrors($e->errors())->withInput();
            }
            
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        try {
            $updateData = [
                'title' => $validated['title'],
                'department_id' => $validated['department_id'],
                'major_id' => $validated['major_id'] ?? null,
                'location' => $validated['location'],
                'salary' => $validated['salary'] ?? null,
                'company_id' => $validated['company_id'],
                'requirements' => $validated['requirements'],
                'benefits' => !empty($validated['benefits']) ? $validated['benefits'] : null,
                'question_pack_id' => $validated['question_pack_id'] ?? null,
                'education_level_id' => $validated['education_level_id'] ?? null,
                'vacancy_type_id' => $validated['vacancy_type_id'],
                'job_description' => $validated['job_description'] ?? null,
            ];
            
            Log::info('Data to be updated: ', $updateData);
            
            $job->update($updateData);

            // Load the fresh model with relationships
            $job = $job->fresh(['company', 'department', 'major', 'questionPack', 'educationLevel', 'vacancyType']);
            
            Log::info('Job updated successfully, fresh data: ', $job->toArray());

            // Handle Inertia requests
            if ($request->header('X-Inertia')) {
                return redirect()->route('admin.jobs.index')->with('success', 'Job updated successfully');
            }

            return response()->json([
                'message' => 'Job updated successfully',
                'job' => $job,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating job: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            // Handle Inertia requests
            if ($request->header('X-Inertia')) {
                return back()->withErrors(['error' => 'Error updating job: ' . $e->getMessage()])->withInput();
            }
            
            return response()->json([
                'message' => 'Error updating job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $job = Vacancies::findOrFail($id);
            $job->delete();

            // Handle Inertia requests
            if (request()->header('X-Inertia')) {
                return redirect()->route('admin.jobs.index')->with('success', 'Job deleted successfully');
            }

            return response()->json([
                'message' => 'Job deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting job: ' . $e->getMessage());
            
            // Handle Inertia requests
            if (request()->header('X-Inertia')) {
                return back()->withErrors(['error' => 'Error deleting job: ' . $e->getMessage()]);
            }
            
            return response()->json([
                'message' => 'Error deleting job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all vacancies with their associated companies and question packs
     */
    private function getVacanciesWithStatus()
    {
        return Vacancies::with(['company', 'department', 'major', 'questionPack', 'educationLevel'])->get();
    }

    /**
     * Get list of vacancies for display
     */
    public function getVacanciesList()
    {
        $vacancies = Vacancies::with(['company', 'department'])
            ->select('id', 'title', 'department_id', 'company_id')
            ->get()
            ->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->department ? $vacancy->department->name : 'Unknown',
                    'company' => $vacancy->company ? $vacancy->company->name : null,
                ];
            });

        return Inertia::render('admin/periods/index', [
            'vacancies' => $vacancies
        ]);
    }

    /**
     * Show the form for creating a new job vacancy
     */
    public function createForm()
    {
        $companies = Company::all();
        $departments = Department::all();
        $majors = MasterMajor::orderBy('name')->get();
        $questionPacks = QuestionPack::select('id', 'pack_name', 'description', 'test_type', 'duration')->get();
        $educationLevels = EducationLevel::orderBy('name')->get();
        $vacancyTypes = VacancyType::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/jobs/create', [
            'companies' => $companies,
            'departments' => $departments,
            'majors' => $majors,
            'questionPacks' => $questionPacks,
            'educationLevels' => $educationLevels,
            'vacancyTypes' => $vacancyTypes,
        ]);
    }

    /**
     * Show the job details
     */
    public function show($id)
    {
        $job = Vacancies::with([
            'company',
            'department',
            'major',
            'questionPack',
            'educationLevel',
            'vacancyType'
        ])->findOrFail($id);

        return Inertia::render('admin/jobs/view', [
            'job' => $job
        ]);
    }

    /**
     * Show the form for editing a job
     */
    public function edit($id)
    {
        $job = Vacancies::with([
            'company',
            'department', 
            'major',
            'questionPack',
            'educationLevel',
            'vacancyType'
        ])->findOrFail($id);
        
        $companies = Company::all();
        $departments = Department::all();
        $majors = MasterMajor::orderBy('name')->get();
        $questionPacks = QuestionPack::select('id', 'pack_name', 'description', 'test_type', 'duration')->get();
        $educationLevels = EducationLevel::orderBy('name')->get();
        $vacancyTypes = VacancyType::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/jobs/edit', [
            'job' => $job,
            'companies' => $companies,
            'departments' => $departments,
            'majors' => $majors,
            'questionPacks' => $questionPacks,
            'educationLevels' => $educationLevels,
            'vacancyTypes' => $vacancyTypes,
        ]);
    }
}
