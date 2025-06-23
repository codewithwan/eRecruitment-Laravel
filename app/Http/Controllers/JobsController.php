<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Models\Candidate;
use App\Models\Vacancies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class JobsController extends Controller
{
    public function index()
    {
        $vacancies = Vacancies::all();
        $appliedVacancyIds = [];
        if (Auth::check()) {
            $appliedVacancyIds = Candidate::where('user_id', Auth::id())
                ->pluck('vacancies_id')
                ->toArray();
        }

        return Inertia::render('candidate/jobs/jobs-lists', [
            'vacancies' => $vacancies,
            'user' => Auth::user(),
            'appliedVacancyIds' => $appliedVacancyIds,
        ]);
    }

    public function apply(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            Vacancies::findOrFail($id);
            // Check if user has already applied to this vacancy
            $existingApplication = Candidate::where('user_id', Auth::id())
                ->where('vacancies_id', $id)
                ->first();

            if ($existingApplication) {
                return redirect()->back()->with('error', 'You have already applied for this position');
            }

            $user_id = Auth::id();
            Candidate::create([
                'user_id' => $user_id,
                'vacancies_id' => $id,
                'applied_at' => now(),
                'status' => ApplicationStatus::ADMINISTRATIVE_SELECTION,
            ]);

            DB::commit();

            Log::info('User applied for a job', ['user_id' => Auth::id(), 'vacancies_id' => $id]);

            return redirect()->back()->with('success', 'Your application has been submitted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error while applying for a job', ['user_id' => Auth::id(), 'vacancies_id' => $id, 'error' => $e->getMessage()]);

            return redirect()->back()->with('error', 'An error occurred while submitting your application. Please try again.');
        }
    }

    public function show()
    {
        return Inertia::render('candidate/chats/candidate-chat');
    }
}
