<?php

namespace App\Http\Controllers;

use App\Enums\CandidatesStage;
use App\Models\Candidate;
use App\Models\Vacancies;
use App\Models\Applications;
use App\Models\CandidatesEducations;
use App\Models\MasterMajor;
use App\Models\CandidatesProfile;
use App\Models\CandidatesProfiles;
use App\Models\JobApplication; // Add this import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JobsController extends Controller
{
    public function index()
    {
        $vacancies = Vacancies::all();
        $appliedVacancyIds = [];
        if (Auth::check()) {
            $appliedVacancyIds = Candidate::where('user_id', Auth::id())
                ->pluck('vacancy_id')
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
        try {
            // Find the vacancy
            $vacancy = Vacancies::findOrFail($id);
            
            // Check if user has already applied
            $existingApplication = Applications::where('vacancies_id', $id)
                ->where('user_id', Auth::id())
                ->first();
                
            if ($existingApplication) {
                return response()->json([
                    'message' => 'Anda sudah pernah melamar pekerjaan ini.'
                ], 422);
            }
            
            // Check if the education data is complete
            $education = CandidatesEducations::where('user_id', Auth::id())->first();
            if (!$education) {
                return response()->json([
                    'message' => 'Data pendidikan belum lengkap. Lengkapi data pendidikan terlebih dahulu.'
                ], 422);
            }
            
            // Check for required education fields
            $requiredFields = ['education_level', 'faculty', 'major_id', 'institution_name', 'gpa'];
            $missingFields = [];
            
            foreach ($requiredFields as $field) {
                if (empty($education->$field)) {
                    $missingFields[] = $field;
                }
            }
            
            if (!empty($missingFields)) {
                return response()->json([
                    'message' => 'Data pendidikan belum lengkap',
                    'errors' => ['education' => 'Data pendidikan belum lengkap: ' . implode(', ', $missingFields)]
                ], 422);
            }
            
            // Create application - USE vacancies_id INSTEAD OF vacancy_id
            $application = new Applications();
            $application->user_id = Auth::id();
            $application->vacancies_id = $id; // Changed from vacancy_id to vacancies_id
            $application->status_id = 1;
            $application->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Lamaran berhasil dikirim!',
                'redirect' => '/candidate/application-history' // FIX: Changed from /jobs/application-history to /candidate/application-history
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error applying for job: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengirim lamaran: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show()
    {
        return Inertia::render('candidate/chats/candidate-chat');
    }

    public function detail($id)
    {
        $vacancy = Vacancies::with('company')->findOrFail($id);

        // Mengambil informasi major
        $majorName = null;
        if ($vacancy->major_id) {
            $major = MasterMajor::find($vacancy->major_id);
            $majorName = $major ? $major->name : null;
        }

        // Convert requirements & benefits to array if they are JSON strings
        $requirements = is_string($vacancy->requirements)
            ? json_decode($vacancy->requirements)
            : $vacancy->requirements;

        $benefits = is_string($vacancy->benefits)
            ? json_decode($vacancy->benefits)
            : $vacancy->benefits;

        // Get user's major if authenticated
        $userMajor = null;
        $isMajorMatched = false;

        if (Auth::check()) {
            $education = CandidatesEducations::where('user_id', Auth::id())->first();
            if ($education) {
                $userMajor = $education->major_id;
                // Cek kesesuaian jurusan
                $isMajorMatched = ($vacancy->major_id == $userMajor);
            }
        }

        return Inertia::render('candidate/detail-job/detail-job', [
            'job' => [
                'id' => $vacancy->id,
                'title' => $vacancy->title,
                'company' => $vacancy->company,
                'job_description' => $vacancy->job_description,
                'requirements' => $requirements,
                'benefits' => $benefits,
                'major_id' => $vacancy->major_id,
                'major_name' => $majorName,
            ],
            'userMajor' => $userMajor,
            'isMajorMatched' => $isMajorMatched
        ]);
    }

    public function jobHiring(Request $request)
    {
        try {
            // Ambil semua lowongan aktif (tanpa join kompleks dulu)
            $jobs = Vacancies::with(['company', 'department'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            // Tambahkan data tipe pekerjaan dari relasi
            foreach ($jobs as $job) {
                // Tambahkan tipe dari relasi yang benar
                $jobType = DB::table('job_types')->find($job->type_id);
                $job->type = $jobType ? $jobType->name : 'Unknown';
                
                // Tambahkan deadline dari periods
                $period = DB::table('periods')
                    ->join('vacancies_periods', 'periods.id', '=', 'vacancies_periods.period_id')
                    ->where('vacancies_periods.vacancy_id', $job->id)
                    ->first();
                
                // Tambahkan deadline ke objek job
                $job->deadline = $period ? $period->end_time : 'Open';
                
                // Tambahkan deskripsi
                $job->description = $job->job_description ?: 'No description available';
            }
            
            $userMajorId = null;
            $recommendations = [];
            $candidateMajor = null;
            
            // Jika user sudah login, tampilkan rekomendasi berdasarkan jurusan
            if (Auth::check()) {
                $education = CandidatesEducations::where('user_id', Auth::id())->first();
                if ($education) {
                    $userMajorId = $education->major_id;
                    
                    // Ambil major name
                    if ($userMajorId) {
                        $major = MasterMajor::find($userMajorId);
                        $candidateMajor = $major ? $major->name : null;
                    }
                    
                    // Filter lowongan yang sesuai dengan jurusan user
                    $matchedJobs = $jobs->filter(function($job) use ($userMajorId) {
                        return $job->major_id == $userMajorId;
                    });
                    
                    // Buat rekomendasi dengan score
                    foreach ($matchedJobs as $job) {
                        $score = 100; // Default score untuk perfect match
                        
                        $recommendations[] = [
                            'vacancy' => $job,
                            'score' => $score
                        ];
                    }
                }
            }
            
            // Data perusahaan untuk filter
            $companies = DB::table('companies')->pluck('name')->toArray();
            
            return Inertia::render('candidate/jobs/job-hiring', [
                'jobs' => $jobs,
                'recommendations' => $recommendations,
                'companies' => $companies,
                'candidateMajor' => $candidateMajor
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in job-hiring: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan. Silakan coba lagi.');
        }
    }

    public function applicationHistory()
    {
        $user = Auth::user();
        $applications = Applications::with(['job', 'job.company'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'status_id' => $app->status_id,
                    'status_name' => $app->status->name ?? 'Pending',
                    'status_color' => $app->status->color ?? '#888',
                    'job' => [
                        'id' => $app->job->id,
                        'title' => $app->job->title,
                        'company' => $app->job->company->name ?? '-',
                        'location' => $app->job->location ?? '-',
                        'type' => $app->job->type ?? '-',
                    ],
                    'applied_at' => $app->created_at->format('Y-m-d H:i'),
                    'updated_at' => $app->updated_at->format('Y-m-d H:i'),
                ];
            });

        return inertia('candidate/jobs/application-history', [
            'applications' => $applications,
        ]);
    }

    // Metode tambahan untuk memeriksa kelengkapan profil
    private function checkProfileComplete($user)
    {
        $profile = \App\Models\CandidatesProfiles::where('user_id', $user->id)->first();

        if (
            !$profile ||
            empty($user->name) ||
            empty($user->email) ||
            empty($profile->phone_number)
        ) {
            return [
                'complete' => false,
                'message' => 'Nama, email, dan nomor telepon wajib diisi.'
            ];
        }

        if (empty($profile->address)) {
            return [
                'complete' => false,
                'message' => 'Alamat wajib diisi.'
            ];
        }

        // Cek pendidikan
        $education = CandidatesEducations::where('user_id', $user->id)->first();
        if (
            !$education ||
            empty($education->institution) ||
            empty($education->major_id) ||
            empty($education->year_graduated)
        ) {
            return [
                'complete' => false,
                'message' => 'Data pendidikan belum lengkap.'
            ];
        }

        // Cek CV
        $hasCV = \Storage::disk('public')->exists('cv/'.$user->id.'.pdf');
        if (!$hasCV) {
            return [
                'complete' => false,
                'message' => 'CV belum diupload.'
            ];
        }

        return [
            'complete' => true,
            'message' => 'Data profil lengkap.'
        ];
    }
}
