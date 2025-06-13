<?php

namespace App\Http\Controllers;

use App\Models\Applications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApplicationHistoryController extends Controller
{
    public function index()
    {
        try {
            // Ambil data aplikasi user yang sedang login
            $applications = Applications::where('user_id', Auth::id())
                ->with([
                    'vacancy:id,title,location,type_id,company_id',
                    'vacancy.company:id,name',
                    'vacancy.jobType:id,name',
                    'selection:id,name,description' // Changed from status to selection
                ])
                ->orderBy('created_at', 'desc')
                ->get();

            // Format data untuk frontend
            $formattedApplications = $applications->map(function ($application) {
                $vacancy = $application->vacancy;
                $selection = $application->selection; // Changed from status to selection

                // Handle jika vacancy null
                if (!$vacancy) {
                    \Log::warning('Vacancy not found for application ID: ' . $application->id);
                    return null;
                }

                return [
                    'id' => $application->id,
                    'status_id' => $application->selection_id ?? 1, // Changed from status_id to selection_id
                    'status_name' => $selection ? $selection->name : 'Administrasi', // Changed default from Pending to Administrasi
                    'status_color' => '#1a73e8', // Use a default color since selection may not have a color field
                    'job' => [
                        'id' => $vacancy->id,
                        'title' => $vacancy->title,
                        'company' => $vacancy->company ? $vacancy->company->name : 'Unknown',
                        'location' => $vacancy->location,
                        'type' => $vacancy->jobType ? $vacancy->jobType->name : 'Full Time',
                    ],
                    'applied_at' => $application->created_at ? $application->created_at->toDateString() : now()->toDateString(),
                    'updated_at' => $application->updated_at ? $application->updated_at->toDateString() : now()->toDateString(),
                ];
            })->filter()->values(); // Filter nulls and reindex

            // Debugging
            \Log::info('Returning applications data', [
                'count' => $formattedApplications->count(),
                'data' => $formattedApplications
            ]);

            // Render dengan data
            return Inertia::render('candidate/application-history', [
                'applications' => $formattedApplications
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching application history: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('candidate/application-history', [
                'applications' => [],
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }

    // Untuk endpoint AJAX jika diperlukan
    public function getApplications()
    {
        try {
            // Ambil data aplikasi user yang sedang login
            $applications = Applications::where('user_id', Auth::id())
                ->with([
                    'vacancy:id,title,location,type_id,company_id',
                    'vacancy.company:id,name',
                    'vacancy.jobType:id,name',
                    'selection:id,name,description' // Changed from status to selection
                ])
                ->orderBy('created_at', 'desc')
                ->get();

            // Format data seperti fungsi index
            $formattedApplications = $applications->map(function ($application) {
                $vacancy = $application->vacancy;
                $selection = $application->selection; // Changed from status to selection

                // Handle jika vacancy null
                if (!$vacancy) {
                    \Log::warning('Vacancy not found for application ID: ' . $application->id);
                    return null;
                }

                return [
                    'id' => $application->id,
                    'status_id' => $application->selection_id ?? 1, // Changed from status_id to selection_id
                    'status_name' => $selection ? $selection->name : 'Administrasi', // Changed default from Pending to Administrasi
                    'status_color' => '#1a73e8', // Use a default color since selection may not have a color field
                    'job' => [
                        'id' => $vacancy->id,
                        'title' => $vacancy->title,
                        'company' => $vacancy->company ? $vacancy->company->name : 'Unknown',
                        'location' => $vacancy->location,
                        'type' => $vacancy->jobType ? $vacancy->jobType->name : 'Full Time',
                    ],
                    'applied_at' => $application->created_at ? $application->created_at->toDateString() : now()->toDateString(),
                    'updated_at' => $application->updated_at ? $application->updated_at->toDateString() : now()->toDateString(),
                ];
            })->filter()->values();

            // Return JSON untuk AJAX
            return response()->json([
                'applications' => $formattedApplications
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
