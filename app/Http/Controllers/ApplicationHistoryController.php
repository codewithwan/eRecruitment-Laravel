<?php

namespace App\Http\Controllers;

use App\Models\Applications;
use App\Models\ApplicationStatutes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApplicationHistoryController extends Controller
{
    public function index()
    {
        // Ambil semua status untuk mappings
        $statuses = ApplicationStatutes::all()->pluck('name', 'id')->toArray();

        // Ambil lamaran user
        $applications = Applications::with(['vacancy', 'vacancy.company', 'status'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($application) use ($statuses) {
                return [
                    'id' => $application->id,
                    'status_id' => $application->status_id,
                    'status_name' => $statuses[$application->status_id] ?? 'Unknown',
                    'status_color' => $this->getStatusColor($application->status_id),
                    'job' => [
                        'id' => $application->vacancy->id,
                        'title' => $application->vacancy->title,
                        'company' => $application->vacancy->company->name,
                        'location' => $application->vacancy->location ?? '-',
                        'type' => $application->vacancy->type ?? 'Full-time',
                    ],
                    'applied_at' => $application->created_at->format('d M Y'),
                    'updated_at' => $application->updated_at->format('d M Y'),
                ];
            });

        return Inertia::render('candidate/jobs/application-history', [
            'applications' => $applications
        ]);
    }

    private function getStatusColor($statusId)
    {
        switch ($statusId) {
            case 1: // Pending
                return '#f39c12'; // Orange
            case 2: // Rejected
                return '#e74c3c'; // Red
            case 3: // Interview
                return '#3498db'; // Blue
            case 4: // Accepted
                return '#27ae60'; // Green
            default:
                return '#95a5a6'; // Grey
        }
    }
}
