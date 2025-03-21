<?php

namespace App\Http\Controllers;

use App\Enums\RecruitmentStageStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Vacancies;
use App\Models\Candidate;
use App\Enums\RecruitmentStage as RecruitmentStageEnum;
use App\Models\RecruitmentStage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JobsController extends Controller
{
    public function index()
    {   
        $vacancies = Vacancies::all();
        
        // Get the list of vacancy IDs that the user has already applied to
        $appliedVacancyIds = [];
        if (Auth::check()) {
            $appliedVacancyIds = Candidate::where('user_id', Auth::id())
                ->pluck('vacancy_id')
                ->toArray();
        }
        
        return Inertia::render('candidate/jobs/jobs-lists', [
            'vacancies' => $vacancies,
            'user' => Auth::user(),
            'appliedVacancyIds' => $appliedVacancyIds
        ]);
    }

    public function apply(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            Vacancies::findOrFail($id);
            
            // Check if user has already applied to this vacancy
            $existingApplication = Candidate::where('user_id', Auth::id())
                ->where('vacancy_id', $id)
                ->first();
                
            if ($existingApplication) {
                return redirect()->back()->with('error', 'You have already applied for this position');
            }
            
            $user_id = Auth::id();
            Candidate::create([
                'user_id' => $user_id,
                'vacancy_id' => $id,
                'applied_at' => now()
            ]);

            RecruitmentStage::create([
                'user_id' => $user_id,
                'stage_name' => RecruitmentStageEnum::ADMINISTRATIVE_SELECTION,
                'status' => RecruitmentStageStatus::IN_PROGRESS,
                'created_at' => now()
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Your application has been submitted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'An error occurred while submitting your application. Please try again.');
        }
    }

    public function show()
    {
        return Inertia::render('candidate/chats/candidate-chat');
    }
}
