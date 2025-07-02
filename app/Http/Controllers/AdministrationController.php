<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Application;
use App\Models\Status;

class AdministrationController extends Controller
{
    public function show($id)
    {
        // Fetch application and related data from database
        $application = \App\Models\Application::with([
            'user',
            'vacancyPeriod.vacancy',
            'vacancyPeriod.period',
            'history.status',
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
        ];

        $periodName = $application->vacancyPeriod->period->name ?? '-';

        return Inertia::render('admin/company/administration-detail', [
            'user' => $user,
            'periodName' => $periodName
        ]);
    }

    public function approve(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        // Update or create administration history
        $application->history()->updateOrCreate(
            ['status_id' => Status::where('code', 'administration')->firstOrFail()->id],
            [
                'processed_at' => now(),
                'notes' => $request->input('notes', 'Passed administration stage.'),
                'score' => $request->input('score'),
                'status_id' => Status::where('code', 'passed')->first()->id, // Status passed
            ]
        );

        // Update application status to assessment
        $application->status_id = Status::where('code', 'assessment')->first()->id;
        $application->save();

        $companyId = $application->vacancyPeriod->vacancy->company_id;
        $periodId = $application->vacancyPeriod->period_id;

        return redirect()->route('company.administration', ['company' => $companyId, 'period' => $periodId])
            ->with('success', 'Candidate approved and moved to assessment phase.');
    }

    public function reject(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        // Update or create administration history
        $application->history()->updateOrCreate(
            ['status_id' => Status::where('code', 'administration')->firstOrFail()->id],
            [
                'processed_at' => now(),
                'notes' => $request->input('notes', 'Rejected at administration stage.'),
                'status_id' => Status::where('code', 'failed')->first()->id, // Status failed
            ]
        );
        
        // Update application status to rejected
        $application->status_id = Status::where('code', 'rejected')->first()->id;
        $application->save();

        $companyId = $application->vacancyPeriod->vacancy->company_id;
        $periodId = $application->vacancyPeriod->period_id;

        return redirect()->route('company.administration', ['company' => $companyId, 'period' => $periodId])
            ->with('success', 'Candidate application has been rejected.');
    }
}