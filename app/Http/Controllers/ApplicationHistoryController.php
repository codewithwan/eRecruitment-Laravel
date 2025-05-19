<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ApplicationHistoryController extends Controller
{
    public function index()
    {
        $candidateId = Auth::id();

        $applications = DB::table('application_history')
            ->join('companies', 'application_history.company_id', '=', 'companies.id')
            ->select(
                'application_history.id',
                'application_history.position_name as title',
                'companies.name as company',
                'application_history.job_description as description',
                'application_history.work_location as location',
                'application_history.work_type as type',
                'application_history.application_deadline as deadline',
                'application_history.status_id'
            )
            ->where('application_history.candidate_id', $candidateId)
            ->orderByDesc('application_history.created_at')
            ->get();

        return Inertia::render('candidate/jobs/application-history', [
            'applications' => $applications,
        ]);
    }
}
