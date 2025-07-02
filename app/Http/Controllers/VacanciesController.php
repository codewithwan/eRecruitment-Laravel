<?php

namespace App\Http\Controllers;

use App\Models\Vacancies;
use App\Models\Company;
use App\Models\Departement;
use App\Models\MasterMajor;
use App\Models\VacancyType;
use App\Models\EducationLevel;
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
        $vacancies = $this->getVacanciesWithStatus();
        $companies = Company::all();
        $departments = Departement::all();
        $majors = MasterMajor::orderBy('name')->get();
        $questionPacks = \App\Models\QuestionPack::all();
        $educationLevels = EducationLevel::orderBy('name')->get();

        // Log data untuk debugging
        Log::info('Jobs Management Data:', [
            'vacancies_count' => $vacancies->count(),
            'companies_count' => $companies->count(),
            'departments_count' => $departments->count(),
            'majors_count' => $majors->count(),
            'questionPacks_count' => $questionPacks->count(),
            'educationLevels_count' => $educationLevels->count(),
        ]);

        return Inertia::render('admin/jobs/jobs-management', [
            'vacancies' => $vacancies,
            'companies' => $companies,
            'departments' => $departments,
            'majors' => $majors,
            'questionPacks' => $questionPacks,
            'educationLevels' => $educationLevels,
        ]);
    }

    public function create(Request $request)
    {
        // Log incoming request data
        Log::info('Job creation request data: ', $request->all());
        
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'department_id' => 'required|integer|exists:departements,id',
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
            ]);
            
            Log::info('Validation passed, validated data: ', $validated);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Job creation validation failed: ', $e->errors());
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
            ];
            
            Log::info('Data to be created: ', $createData);
            
            $job = Vacancies::create($createData);

            // Load the relationships
            $job->load(['company', 'departement', 'major', 'questionPack', 'educationLevel']);
            
            Log::info('Job created successfully with ID: ' . $job->id);
            
            return response()->json([
                'message' => 'Job created successfully',
                'job' => $job,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating job: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Error creating job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $job = Vacancies::findOrFail($id);
        
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'department_id' => 'required|integer|exists:departements,id',
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
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Job update validation failed: ', $e->errors());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        try {
            $job->update([
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
            ]);

            // Load the fresh model with relationships
            $job = $job->fresh(['company', 'departement', 'major', 'questionPack', 'educationLevel']);

            return response()->json([
                'message' => 'Job updated successfully',
                'job' => $job,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating job: ' . $e->getMessage());
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

            return response()->json([
                'message' => 'Job deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting job: ' . $e->getMessage());
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
        $vacancies = Vacancies::with(['company', 'departement', 'major', 'questionPack', 'educationLevel'])->get();
        
        return $vacancies->map(function ($vacancy) {
            // Set all vacancies as open by default
            $vacancy->status = 'Open';
            
            // Ensure requirements and benefits are always arrays
            $vacancy->requirements = is_array($vacancy->requirements) ? $vacancy->requirements : [];
            $vacancy->benefits = is_array($vacancy->benefits) ? $vacancy->benefits : [];
            
            // Ensure questionPack is properly loaded and included in the response
            if ($vacancy->questionPack) {
                $vacancy->questionPack = [
                    'id' => $vacancy->questionPack->id,
                    'pack_name' => $vacancy->questionPack->pack_name,
                    'description' => $vacancy->questionPack->description,
                    'test_type' => $vacancy->questionPack->test_type,
                    'duration' => $vacancy->questionPack->duration,
                ];
            }
            
            return $vacancy;
        });
    }
}
