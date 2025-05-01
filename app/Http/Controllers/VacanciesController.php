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

        Log::info($vacancies);

        return Inertia::render('admin/jobs/jobs-management', [
            'vacancies' => $vacancies,
            'companies' => $companies,
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'company_id' => 'required|exists:companies,id',
            'requirements' => 'required|array',
            'benefits' => 'nullable|array',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $user_id = Auth::user()->id;
        $job = Vacancies::create([
            'user_id' => $user_id,
            'title' => $validated['title'],
            'department' => $validated['department'],
            'location' => $validated['location'],
            'company_id' => $validated['company_id'],
            'requirements' => $validated['requirements'],
            'benefits' => $validated['benefits'] ?? [],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);

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
            'company_id' => 'required|exists:companies,id',
            'requirements' => 'required|array',
            'benefits' => 'nullable|array',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $job->update([
            'title' => $validated['title'],
            'department' => $validated['department'],
            'location' => $validated['location'],
            'company_id' => $validated['company_id'],
            'requirements' => $validated['requirements'],
            'benefits' => $validated['benefits'] ?? [],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);

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
     * Get all vacancies with their status based on date
     */
    private function getVacanciesWithStatus()
    {
        $today = Carbon::today();
        $vacancies = Vacancies::with('company')->get();
        
        return $vacancies->map(function ($vacancy) use ($today) {
            $startDate = Carbon::parse($vacancy->start_date);
            $endDate = Carbon::parse($vacancy->end_date);
            
            // Calculate status based on date
            $status = ($today->between($startDate, $endDate)) ? 'Open' : 'Closed';
            
            // Add status and format dates
            $vacancy->status = $status;
            
            return $vacancy;
        });
    }
}
