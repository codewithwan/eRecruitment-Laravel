<?php

namespace App\Http\Controllers;

use App\Enums\CandidatesStage;
use App\Models\Candidate;
use App\Models\Vacancies;
use App\Models\Applications;
use App\Models\CandidatesEducations;
use App\Models\MasterMajor; // Tambahkan ini
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // Tambahkan ini
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
        DB::beginTransaction();

        try {
            $user = auth()->user();
            $vacancy = Vacancies::findOrFail($id);

            // Cek jurusan - Validasi utama kesesuaian jurusan
            $education = CandidatesEducations::where('user_id', $user->id)->first();
            if (!$education) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pendidikan Anda belum lengkap.',
                    'redirect' => '/candidate/personal-data'
                ], 422);
            }

            // Jika vacancy tidak memiliki major_id, abaikan pengecekan
            if ($vacancy->major_id && $vacancy->major_id != $education->major_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lowongan pekerjaan ini tidak sesuai dengan jurusan Anda.'
                ], 422);
            }

            // Cek kelengkapan data
            $profileComplete = $this->checkProfileComplete($user);
            if (!$profileComplete['complete']) {
                return response()->json([
                    'success' => false,
                    'message' => $profileComplete['message'],
                    'redirect' => '/candidate/personal-data' // Perbaiki path
                ], 422);
            }

            // Proses apply sesuai dengan gambar yang ditampilkan
            Applications::create([
                'user_id' => $user->id,
                'vacancies_id' => $vacancy->id,
                'status_id' => 1, // 1 = pending
            ]);

            DB::commit();

            // Return JSON response dengan redirect ke halaman application-history
            return response()->json([
                'success' => true,
                'message' => 'Lamaran berhasil dikirim!',
                'redirect' => '/candidate/application-history' // Perbaiki path
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error while applying for a job', [
                'user_id' => Auth::id(),
                'vacancy_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat apply lowongan. Silakan coba lagi.'
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

    // Metode tambahan untuk memeriksa kelengkapan profil
    private function checkProfileComplete($user)
    {
        // Cek data pribadi dasar
        if (empty($user->name) || empty($user->email) || empty($user->phone_number)) {
            return [
                'complete' => false,
                'message' => 'Nama, email, dan nomor telepon wajib diisi.'
            ];
        }

        // Cek alamat
        if (empty($user->address)) {
            return [
                'complete' => false,
                'message' => 'Alamat wajib diisi.'
            ];
        }

        // Cek pendidikan
        $education = CandidatesEducations::where('user_id', $user->id)->first();
        if (!$education || empty($education->institution) || empty($education->major_id) || empty($education->year_graduated)) {
            return [
                'complete' => false,
                'message' => 'Data pendidikan belum lengkap.'
            ];
        }

        // Cek CV
        $hasCV = Storage::disk('public')->exists('cv/'.$user->id.'.pdf');
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
