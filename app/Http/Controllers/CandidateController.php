<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\CandidateTest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
// use App\Models\Candidate;
use App\Models\RecruitmentStage;
use App\Models\Vacancies;
use App\Enums\RecruitmentStage as RecruitmentStageEnum;
use App\Enums\RecruitmentStageStatus;

class CandidateController extends Controller
{
    public function index()
    {
        $authUser = Auth::user();
        
        // Get candidate's application data
        $candidateApplication = Candidate::where('user_id', $authUser->id)
            ->with('vacancy')
            ->latest()
            ->first();
            
        // Get recruitment stages for this user
        $recruitmentStages = RecruitmentStage::where('user_id', $authUser->id)
            ->orderBy('created_at')
            ->get();
            
        // // Format stages for front-end
        // $formattedStages = [];
        
        // if ($candidateApplication) {
        //     // First add the administrative stage
        //     $adminStage = $recruitmentStages->where('stage_name', RecruitmentStageEnum::ADMINISTRATIVE_SELECTION)->first();
            
        //     $formattedStages[] = [
        //         'id' => 1,
        //         'name' => 'Seleksi Administrasi',
        //         'status' => $this->getStatusForFrontend($adminStage ? $adminStage->status : null),
        //         'date' => $adminStage && $adminStage->status === RecruitmentStageEnum::INTERVIEW->value ? 
        //             $adminStage->updated_at->format('d F Y') : null,
        //     ];
            
        //     // Add psychotest stage
        //     $psychotestStage = $recruitmentStages->where('stage_name', RecruitmentStageEnum::PSYCHOTEST)->first();
        //     // Only allow access to psychotest if admin stage is COMPLETED, not just IN_PROGRESS
        //     $canAccessPsychotest = $adminStage && $adminStage->status === RecruitmentStageStatus::COMPLETED;
            
        //     $formattedStages[] = [
        //         'id' => 2,
        //         'name' => 'Tes Psikotes',
        //         'status' => $canAccessPsychotest ? 
        //             ($psychotestStage ? $this->getStatusForFrontend($psychotestStage->status) : 'scheduled') : 
        //             'waiting',
        //         'date' => $canAccessPsychotest ? date('d F Y') : null,
        //         'time' => $canAccessPsychotest ? '09:00 WIB' : null,
        //         'duration' => '90 menit',
        //         'testType' => 'Tes Kepribadian & Logika',
        //         'location' => 'Online via Platform',
        //         'notes' => 'Harap siapkan diri Anda dengan baik. Pastikan koneksi internet stabil dan perangkat siap.',
        //     ];
            
        //     // Add interview stage
        //     $interviewStage = $recruitmentStages->where('stage_name', RecruitmentStageEnum::INTERVIEW)->first();
        //     // Interview is only accessible if psychotest is completed
        //     $canAccessInterview = $psychotestStage && $psychotestStage->status === RecruitmentStageStatus::COMPLETED;
            
        //     $formattedStages[] = [
        //         'id' => 3,
        //         'name' => 'Wawancara',
        //         'status' => $canAccessInterview ?
        //             ($interviewStage ? $this->getStatusForFrontend($interviewStage->status) : 'scheduled') :
        //             'waiting',
        //     ];
        // } 
        
        return Inertia::render('candidate/candidate-dashboard', [
            'users' => $authUser,
            'candidateApplication' => $candidateApplication,
            'recruitmentStages' => $recruitmentStages,
            // 'stages' => $formattedStages,
            // 'hasApplied' => !empty($candidateApplication)
        ]);
    }
    
    private function getStatusForFrontend($status)
    {
        switch ($status) {
            case RecruitmentStageStatus::COMPLETED:
                return 'completed';
            case RecruitmentStageStatus::IN_PROGRESS:
                return 'waiting'; 
            case RecruitmentStageStatus::SCHEDULED:
                return 'scheduled';
            case RecruitmentStageStatus::FAILED:
                return 'failed';
            default:
                return 'waiting';
        }
    }

    public function store()
    {
        return Inertia::render('candidate/profile/candidate-profile');
    }

    public function show()
    {
        // $candidates = Candidate::all();
        return Inertia::render('admin/candidates/candidate-list');
    }
}
