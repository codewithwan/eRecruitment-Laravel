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
use App\Models\Selections;
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
        try {
            // Ambil semua lowongan aktif
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

    public function apply(Request $request, $id)
    {
        try {
            // Check if user has already applied
            $existingApplication = Applications::where('user_id', Auth::id())
                ->where('vacancies_id', $id)
                ->first();

            if ($existingApplication) {
                \Log::info('User already applied for job', [
                    'user_id' => Auth::id(),
                    'job_id' => $id,
                    'redirect_url' => route('candidate.application-history')
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Anda sudah pernah melamar pekerjaan ini.',
                    'redirect' => route('candidate.application-history')
                ], 422);
            }

            // Check if the education data is complete
            $education = CandidatesEducations::where('user_id', Auth::id())->first();
            if (!$education) {
                return response()->json([
                    'message' => 'Data pendidikan belum lengkap. Lengkapi data pendidikan terlebih dahulu.'
                ], 422);
            }

            // Ambil selection default (Administrasi)
            $initialSelection = Selections::where('name', 'Administrasi')->first();
            if (!$initialSelection) {
                $initialSelection = Selections::create([
                    'name' => 'Administrasi',
                    'description' => 'Tahap seleksi administrasi kandidat'
                ]);
            }

            // Buat aplikasi baru
            $application = Applications::create([
                'user_id' => Auth::id(),
                'vacancies_id' => $id,
                'selection_id' => $initialSelection->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            \Log::info('User successfully applied for job', [
                'user_id' => Auth::id(),
                'job_id' => $id,
                'application_id' => $application->id
            ]);

            // Return sukses
            return response()->json([
                'success' => true,
                'message' => 'Lamaran berhasil dikirim!',
                'redirect' => route('candidate.application-history')
            ]);

        } catch (\Exception $e) {
            \Log::error('Error while applying for job', [
                'user_id' => Auth::id(),
                'job_id' => $id,
                'error' => $e->getMessage()
            ]);

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

    // applicationHistory method has been removed and replaced with a dedicated ApplicationHistoryController

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
