<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Application;
use App\Models\Status;

class AssessmentController extends Controller
{
    /**
     * Display the specified assessment detail.
     */
    public function show(string $id): Response
    {
        // Fetch application and related data from database
        $application = \App\Models\Application::with([
            'user',
            'vacancyPeriod.vacancy',
            'vacancyPeriod.period',
            'assessment.status',
            'assessment',
        ])->findOrFail($id);

        $assessmentHistory = $application->assessment;
        $assessmentQuestions = [];
        $totalScore = 0;
        $maxTotalScore = 0;

        if ($assessmentHistory && $assessmentHistory->test_results) {
            // test_results assumed to be an array of question results
            foreach ($assessmentHistory->test_results as $result) {
                $assessmentQuestions[] = [
                    'id' => $result['id'] ?? '',
                    'question' => $result['question'] ?? '',
                    'answer' => $result['answer'] ?? '',
                    'score' => $result['score'] ?? 0,
                    'maxScore' => $result['maxScore'] ?? 0,
                    'category' => $result['category'] ?? '',
                ];
                $totalScore += $result['score'] ?? 0;
                $maxTotalScore += $result['maxScore'] ?? 0;
            }
        }

        $assessmentData = [
            'id' => $application->id,
            'name' => $application->user->name,
            'email' => $application->user->email,
            'phone' => $application->user->phone ?? null,
            'position' => $application->vacancyPeriod->vacancy->title ?? '-',
            'vacancy' => $application->vacancyPeriod->vacancy->title ?? '-',
            'company_id' => $application->vacancyPeriod->vacancy->company_id ?? null,
            'period_id' => $application->vacancyPeriod->period_id ?? null,
            'registration_date' => $application->created_at->format('Y-m-d'),
            'assessment_date' => $assessmentHistory && $assessmentHistory->completed_at ? $assessmentHistory->completed_at->format('Y-m-d') : null,
            'cv_path' => $application->user->cv_path ?? null,
            'portfolio_path' => $application->user->portfolio_path ?? null,
            'cover_letter' => $application->user->cover_letter ?? null,
            'status' => $assessmentHistory && $assessmentHistory->status ? $assessmentHistory->status->code : 'pending',
            'total_score' => $totalScore,
            'max_total_score' => $maxTotalScore > 0 ? $maxTotalScore : 100,
            'notes' => $assessmentHistory ? $assessmentHistory->notes : null,
            'questions' => $assessmentQuestions,
        ];

        return Inertia::render('admin/company/assessment-detail', [
            'assessment' => $assessmentData
        ]);
    }

    /**
     * Approve a candidate for interview stage.
     */
    public function approve(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        // Update or create assessment history
        $application->history()->updateOrCreate(
            ['status_id' => Status::where('code', 'assessment')->first()->id],
            [
                'processed_at' => now(),
                'notes' => $request->input('hr_notes', 'Passed assessment stage.'),
                'status_id' => Status::where('code', 'passed')->first()->id, // Status passed
            ]
        );

        // Update application status to interview
        $application->status_id = Status::where('code', 'interview')->first()->id;
        $application->save();

        $companyId = $application->vacancyPeriod->vacancy->company_id;
        $periodId = $application->vacancyPeriod->period_id;

        return redirect()->route('company.interview', ['company' => $companyId, 'period' => $periodId])
            ->with('success', 'Candidate approved and moved to interview phase.');
    }

    /**
     * Reject a candidate.
     */
    public function reject(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        // Update or create assessment history
        $application->history()->updateOrCreate(
            ['status_id' => Status::where('code', 'assessment')->first()->id],
            [
                'processed_at' => now(),
                'notes' => $request->input('hr_notes', 'Rejected at assessment stage.'),
                'status_id' => Status::where('code', 'failed')->first()->id, // Status failed
            ]
        );

        // Update application status to rejected
        $application->status_id = Status::where('code', 'rejected')->first()->id;
        $application->save();

        $companyId = $application->vacancyPeriod->vacancy->company_id;
        $periodId = $application->vacancyPeriod->period_id;

        return redirect()->route('company.assessment', ['company' => $companyId, 'period' => $periodId])
            ->with('success', 'Candidate application has been rejected.');
    }
}