<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Application;
use App\Models\Status;
use App\Models\ApplicationHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AdministrationController extends Controller
{
    public function show($id)
    {
        // Fetch application and related data from database
        $application = Application::with([
            'user',
            'vacancyPeriod.vacancy',
            'vacancyPeriod.period',
            'history.status',
            'administration',
            'assessment',
            'interview'
        ])->findOrFail($id);

        $user = [
            'id' => $application->id,
            'name' => $application->user->name,
            'email' => $application->user->email,
            'position' => $application->vacancyPeriod->vacancy->title ?? '-',
            'registration_date' => $application->created_at->format('Y-m-d'),
            'cv' => [
                'filename' => $application->user->name . '_cv.pdf',
                'fileType' => 'pdf',
                'url' => '/uploads/cv/' . $application->user->name . '_cv.pdf',
            ],
            'company_id' => $application->vacancyPeriod->vacancy->company_id ?? null,
            'period_id' => $application->vacancyPeriod->period_id ?? null,
            'vacancy' => $application->vacancyPeriod->vacancy->title ?? '-',
            'phone' => $application->user->phone ?? null,
            'address' => $application->user->address ?? null,
            'education' => $application->user->education ?? null,
            'experience' => $application->user->experience ?? null,
            'skills' => $application->user->skills ? $application->user->skills->pluck('name')->toArray() : [],
            'status' => $application->status->code ?? 'pending',
            'stages' => [
                'administrative_selection' => [
                    'status' => $application->administration?->status ?? 'pending',
                    'notes' => $application->administration?->notes,
                    'score' => $application->administration?->score,
                    'processed_at' => $application->administration?->processed_at?->format('Y-m-d H:i:s'),
                ],
                'psychological_test' => [
                    'status' => $application->assessment?->status ?? null,
                    'scheduled_at' => $application->assessment?->scheduled_at?->format('Y-m-d H:i:s'),
                    'completed_at' => $application->assessment?->completed_at?->format('Y-m-d H:i:s'),
                    'score' => $application->assessment?->score,
                    'notes' => $application->assessment?->notes,
                ],
                'interview' => [
                    'status' => $application->interview?->status ?? null,
                    'scheduled_at' => $application->interview?->scheduled_at?->format('Y-m-d H:i:s'),
                    'completed_at' => $application->interview?->completed_at?->format('Y-m-d H:i:s'),
                    'notes' => $application->interview?->notes,
                ],
            ],
        ];

        $periodName = $application->vacancyPeriod->period->name ?? '-';

        return Inertia::render('admin/company/administration-detail', [
            'user' => $user,
            'periodName' => $periodName
        ]);
    }

    public function approve(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $application = Application::findOrFail($id);
            $adminStatus = Status::where('code', 'administration')->firstOrFail();
            $passedStatus = Status::where('code', 'passed')->firstOrFail();
            $assessmentStatus = Status::where('code', 'assessment')->firstOrFail();

            // Update or create administration history with passed status
            $history = $application->history()->updateOrCreate(
                ['status_id' => $adminStatus->id],
                [
                    'processed_at' => now(),
                    'notes' => $request->input('notes', 'Passed administration stage.'),
                    'score' => $request->input('score'),
                    'status_id' => $passedStatus->id,
                    'reviewed_by' => Auth::id(),
                    'reviewed_at' => now(),
                ]
            );

            // Create assessment history entry with pending status
            $application->history()->create([
                'status_id' => $assessmentStatus->id,
                'processed_at' => now(),
                'notes' => 'Pending assessment stage.',
                'is_active' => true,
            ]);

            // Update application status to assessment
            $application->status_id = $assessmentStatus->id;
            $application->save();

            DB::commit();

            $companyId = $application->vacancyPeriod->vacancy->company_id;
            $periodId = $application->vacancyPeriod->period_id;

            return redirect()->route('company.administration', ['company' => $companyId, 'period' => $periodId])
                ->with('success', 'Candidate approved and moved to assessment phase.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to approve candidate. Please try again.');
        }
    }

    public function reject(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $application = Application::findOrFail($id);
            $adminStatus = Status::where('code', 'administration')->firstOrFail();
            $failedStatus = Status::where('code', 'failed')->firstOrFail();
            $rejectedStatus = Status::where('code', 'rejected')->firstOrFail();

            // Update or create administration history with failed status
            $history = $application->history()->updateOrCreate(
                ['status_id' => $adminStatus->id],
                [
                    'processed_at' => now(),
                    'notes' => $request->input('notes', 'Rejected at administration stage.'),
                    'status_id' => $failedStatus->id,
                    'reviewed_by' => Auth::id(),
                    'reviewed_at' => now(),
                ]
            );

            // Update application status to rejected
            $application->status_id = $rejectedStatus->id;
            $application->save();

            DB::commit();

            $companyId = $application->vacancyPeriod->vacancy->company_id;
            $periodId = $application->vacancyPeriod->period_id;

            return redirect()->route('company.administration', ['company' => $companyId, 'period' => $periodId])
                ->with('success', 'Candidate application has been rejected.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reject candidate. Please try again.');
        }
    }
}