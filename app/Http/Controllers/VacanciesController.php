<?php

namespace App\Http\Controllers;

use App\Models\Vacancies;
use App\Models\Company;
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
        $questionPacks = \App\Models\QuestionPack::all();

        Log::info($vacancies);

        return Inertia::render('admin/jobs/jobs-management', [
            'vacancies' => $vacancies,
            'companies' => $companies,
            'questionPacks' => $questionPacks,
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'company_id' => 'required|exists:companies,id',
            'requirements' => 'required|array',
            'benefits' => 'nullable|array',
            'question_pack_id' => 'nullable|exists:question_packs,id',
        ]);

        $user_id = Auth::user()->id;
        $job = Vacancies::create([
            'user_id' => $user_id,
            'title' => $validated['title'],
            'department' => $validated['department'],
            'location' => $validated['location'],
            'salary' => $validated['salary'] ?? null,
            'company_id' => $validated['company_id'],
            'requirements' => $validated['requirements'],
            'benefits' => $validated['benefits'] ?? [],
            'question_pack_id' => $validated['question_pack_id'] ?? null,
        ]);

        // Load the question pack relationship
        $job->load('questionPack');
        
        return response()->json([
            'message' => 'Job created successfully',
            'job' => $job,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $job = Vacancies::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'company_id' => 'required|exists:companies,id',
            'requirements' => 'required|array',
            'benefits' => 'nullable|array',
            'question_pack_id' => 'nullable|exists:question_packs,id',
        ]);

        $job->update([
            'title' => $validated['title'],
            'department' => $validated['department'],
            'location' => $validated['location'],
            'salary' => $validated['salary'] ?? null,
            'company_id' => $validated['company_id'],
            'requirements' => $validated['requirements'],
            'benefits' => $validated['benefits'] ?? [],
            'question_pack_id' => $validated['question_pack_id'] ?? null,
        ]);

        // Load the fresh model with relationships
        $job = $job->fresh(['company', 'questionPack']);

        return response()->json([
            'message' => 'Job updated successfully',
            'job' => $job,
        ]);
    }

    public function destroy($id)
    {
        $job = Vacancies::findOrFail($id);
        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully',
        ]);
    }

    /**
     * Get all vacancies with their associated companies and question packs
     */
    private function getVacanciesWithStatus()
    {
        $vacancies = Vacancies::with(['company', 'questionPack'])->get();
        
        return $vacancies->map(function ($vacancy) {
            // Set all vacancies as open by default
            $vacancy->status = 'Open';
            
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
