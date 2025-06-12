<?php

namespace App\Http\Controllers;

use App\Models\Applications;
use App\Models\Statuses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApplicationHistoryController extends Controller
{
    public function index()
    {
        try {
            \Log::info('Starting application history retrieval for user: ' . Auth::id());
            
            // Ambil semua lamaran user yang login
            $applications = Applications::where('user_id', Auth::id())
                ->with(['vacancy:id,title,location,type', 'status:id,name,color'])
                ->orderBy('created_at', 'desc')
                ->get();
                
            \Log::info('Retrieved ' . $applications->count() . ' applications');
                
            $formattedApplications = $applications->map(function ($application) {
                // Pastikan semua relasi terload dengan benar
                $vacancy = $application->vacancy;
                $status = $application->status;
                
                if (!$status) {
                    \Log::warning('Status not found for application ID: ' . $application->id);
                }
                
                return [
                    'id' => $application->id,
                    'status_id' => $application->status_id,
                    'status_name' => $status ? $status->name : 'Unknown',
                    'status_color' => $status ? $status->color : '#999',
                    'job' => [
                        'id' => $vacancy ? $vacancy->id : 0,
                        'title' => $vacancy ? $vacancy->title : 'Unknown',
                        'company' => $vacancy && $vacancy->company ? $vacancy->company->name : 'Unknown',
                        'location' => $vacancy ? $vacancy->location : 'Unknown',
                        'type' => $vacancy ? $vacancy->type : 'Unknown',
                    ],
                    'applied_at' => $application->created_at->format('d M Y'),
                    'updated_at' => $application->updated_at->format('d M Y'),
                ];
            });

            return Inertia::render('candidate/application-history', [
                'applications' => $formattedApplications
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error in application history: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'exception' => $e
            ]);
            
            // Return empty applications array with error message
            return Inertia::render('candidate/application-history', [
                'applications' => [],
                'error' => 'Terjadi kesalahan saat memuat riwayat lamaran.'
            ]);
        }
    }
}
