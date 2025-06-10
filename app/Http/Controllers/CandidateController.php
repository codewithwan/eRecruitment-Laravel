<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\CandidatesProfiles;
use App\Models\CandidatesEducations;
use App\Models\CandidatesWorkExperiences;
use App\Models\UserWorkExperiences;
use App\Models\WorkExperience;
use App\Models\CandidatesOrganizations;
use App\Models\CandidatesAchievements;
use App\Models\CandidatesSocialMedia;
use App\Models\Skills;
use App\Models\Courses;
use App\Models\Certifications;
use App\Models\Languages;
use App\Models\EnglishCertifications;
use App\Models\CandidateCV;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use App\Models\MasterGender;

class CandidateController extends Controller
{
    // public function dashboard()
    // {
    //     $user = Auth::user();

    //     return Inertia::render('candidate/dashboard', [
    //         'users' => $user,
    //     ]);
    // }
    public function dashboard()
    {
        $user = Auth::user();
        $education = CandidatesEducations::where('user_id', $user->id)->first(); // Tambahkan ini
        
        // Ambil semua data gender dari master_genders
        $genders = MasterGender::all();

        return Inertia::render('PersonalData', [
            'education' => $education, // Tambahkan ini
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'genders' => $genders->map(function($gender) {
                return [
                    'value' => $gender->name,
                    'label' => $gender->name
                ];
            })
        ]);
    }

    public function profile()
    {
        $user = Auth::user();
        $profile = CandidatesProfiles::where('user_id', $user->id)->first();
        $education = CandidatesEducations::where('user_id', $user->id)->first(); // Tambahkan ini
        
        // Ambil semua data gender dari master_genders
        $genders = MasterGender::all();
        
        return Inertia::render('PersonalData', [
            'profile' => $profile,
            'education' => $education, // Tambahkan ini
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'genders' => $genders->map(function($gender) {
                return [
                    'value' => $gender->name,
                    'label' => $gender->name
                ];
            })
        ]);
    }

    public function storeDataPribadi(Request $request)
    {
        try {
            $validated = $request->validate([
                'no_ektp' => 'required|string|max:16',
                'gender' => 'required|in:male,female',
                'phone_number' => 'required|string',
                'npwp' => 'nullable|string',
                'about_me' => 'required|string',
                'place_of_birth' => 'required|string',
                'date_of_birth' => 'required|date',
                'address' => 'required|string',
                'province' => 'required|string',
                'city' => 'required|string',
                'district' => 'required|string',
                'village' => 'required|string',
                'rt' => 'required|string',
                'rw' => 'required|string',
            ]);

            $result = CandidatesProfiles::storeProfile($validated, Auth::id());

            return back()->with('flash', [
                'type' => 'success',
                'message' => 'Data berhasil disimpan!'
            ]);

        } catch (ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data'
            ]);
        }
    }

    public function show()
    {
        return Inertia::render('admin/candidates/candidate-list');
    }

    public function showEducationForm()
    {
        $user = Auth::user();
        $education = CandidatesEducations::where('user_id', $user->id)->first();

        return Inertia::render('DataPribadiForm', [
            'profile' => [
                'education' => $education
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }

    public function education()
    {
        $education = CandidatesEducations::where('user_id', Auth::id())->first();

        return Inertia::render('Education/Form', [
            'education' => $education
        ]);
    }

    public function getEducation()
    {
        $education = CandidatesEducations::where('user_id', Auth::id())->first();
        return response()->json($education);
    }

    public function storeEducation(Request $request)
    {
        $validated = $request->validate([
            'education_level' => 'required|string',
            'faculty' => 'required|string',
            'major' => 'required|string',
            'institution_name' => 'required|string',
            'gpa' => 'required|numeric|between:0,4',
            'year_in' => 'required|integer',
            'year_out' => 'required|integer'
        ]);

        $education = CandidatesEducations::updateOrCreate(
            ['user_id' => Auth::id()],
            $validated
        );

        return response()->json($education);
    }

    public function getAllWorkExperiences()
    {
        $experiences = CandidatesWorkExperiences::where('user_id', Auth::id())->get();
        return response()->json($experiences);
    }

    public function getWorkExperiences()
    {
        $userId = Auth::id();
        $workExperiences = CandidatesWorkExperiences::where('user_id', $userId)->get();

        return response()->json($workExperiences);
    }

    public function indexWorkExperiences()
    {
        $workExperiences = CandidatesWorkExperiences::where('user_id', Auth::id())->get();
        return response()->json($workExperiences);
    }

    public function showWorkExperience($id)
    {
        $workExperience = CandidatesWorkExperiences::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return response()->json($workExperience);
    }

    public function storeWorkExperience(Request $request)
    {
        $validated = $request->validate([
            'job_title' => 'required|string|max:255',
            'employment_status' => 'required|string|max:255',
            'job_description' => 'required|string|min:10', // Ubah dari 100 menjadi 10
            'is_current_job' => 'required|boolean',
            'start_month' => 'required|integer|min:1|max:12',
            'start_year' => 'required|integer|min:1900|max:' . date('Y'),
            'end_month' => 'nullable|integer|min:1|max:12',
            'end_year' => 'nullable|integer|min:1900|max:' . date('Y'),
        ]);

        $validated['user_id'] = Auth::id();

        $workExperience = CandidatesWorkExperiences::create($validated);

        return response()->json([
            'message' => 'Data berhasil disimpan!',
            'data' => $workExperience,
        ], 201);
    }

    public function updateWorkExperience(Request $request, $id)
    {
        $workExperience = CandidatesWorkExperiences::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'job_title' => 'required|string|max:255',
            'employment_status' => 'required|string|max:255',
            'job_description' => 'required|string|min:10', // Ubah dari 100 menjadi 10
            'is_current_job' => 'required|boolean',
            'start_month' => 'required|integer|min:1|max:12',
            'start_year' => 'required|integer|min:1900|max:' . date('Y'),
            'end_month' => 'nullable|integer|min:1|max:12',
            'end_year' => 'nullable|integer|min:1900|max:' . date('Y'),
        ]);

        $workExperience->update($validated);

        return response()->json([
            'message' => 'Data berhasil diperbarui!',
            'data' => $workExperience,
        ], 200);
    }

    public function deleteWorkExperience($id)
    {
        $workExperience = CandidatesWorkExperiences::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $workExperience->delete();

        return response()->json([
            'message' => 'Data berhasil dihapus!',
        ]);
    }

    public function getWorkExperience($id)
    {
        $experience = CandidatesWorkExperiences::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return response()->json($experience);
    }

    public function editWorkExperience($id)
    {
        $workExperience = CandidatesWorkExperiences::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('EditPengalamanKerjaForm', [
            'experienceData' => $workExperience,
        ]);
    }

    public function indexOrganizations()
    {
        $organizations = CandidatesOrganizations::where('user_id', Auth::id())->get();
        return response()->json($organizations);
    }

    public function storeOrganization(Request $request)
    {
        try {
            $validated = $request->validate([
                'organization_name' => 'required|string|max:255',
                'position' => 'required|string|max:255',
                'description' => 'required|string|min:10',
                'is_active' => 'required|boolean',
                'start_month' => 'required|string',
                'start_year' => 'required|integer|min:1900|max:' . date('Y'),
                'end_month' => 'nullable|required_if:is_active,false|string',
                'end_year' => 'nullable|required_if:is_active,false|integer|min:1900|max:' . date('Y'),
            ], [
                'organization_name.required' => 'Nama organisasi harus diisi',
                'position.required' => 'Posisi harus diisi',
                'description.required' => 'Deskripsi harus diisi',
                'description.min' => 'Deskripsi minimal 10 karakter',
                'start_month.required' => 'Bulan masuk harus dipilih',
                'start_year.required' => 'Tahun masuk harus dipilih',
                'end_month.required_if' => 'Bulan keluar harus dipilih jika tidak aktif',
                'end_year.required_if' => 'Tahun keluar harus dipilih jika tidak aktif',
            ]);

            $validated['user_id'] = Auth::id();

            $organization = CandidatesOrganizations::create($validated);

            return response()->json([
                'message' => 'Data berhasil disimpan!',
                'data' => $organization
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error saving organization: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateOrganization(Request $request, $id)
    {
        $organization = CandidatesOrganizations::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'organization_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'is_active' => 'required|boolean',
            'start_year' => 'required|integer|min:1900|max:' . date('Y'),
            'end_year' => 'nullable|integer|min:1900|max:' . date('Y'),
        ]);

        $organization->update($validated);

        return response()->json([
            'message' => 'Data berhasil diperbarui!',
            'data' => $organization,
        ], 200);
    }

    public function storeAchievement(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'level' => 'required|string|in:Internasional,Nasional,Regional,Lokal',
                'month' => 'required|string|in:Januari,Februari,Maret,April,Mei,Juni,Juli,Agustus,September,Oktober,November,Desember',
                'year' => 'required|string',
                'description' => 'required|string|min:10',
                'certificate_file' => 'required|file|mimes:pdf,jpg,jpeg,doc,docx|max:500',
                'supporting_file' => 'nullable|file|mimes:pdf,jpg,jpeg,doc,docx|max:500',
            ], [
                'title.required' => 'Nama kompetisi harus diisi',
                'title.max' => 'Nama kompetisi maksimal 255 karakter',
                'level.required' => 'Skala kompetisi harus dipilih',
                'level.in' => 'Skala kompetisi tidak valid',
                'month.required' => 'Bulan harus dipilih',
                'month.in' => 'Bulan tidak valid',
                'year.required' => 'Tahun harus dipilih',
                'description.required' => 'Deskripsi harus diisi',
                'description.min' => 'Deskripsi minimal 10 karakter',
                'certificate_file.required' => 'File sertifikat harus diupload',
                'certificate_file.mimes' => 'Format file sertifikat harus pdf, jpg, jpeg, doc, atau docx',
                'certificate_file.max' => 'Ukuran file sertifikat maksimal 500KB',
                'supporting_file.mimes' => 'Format file pendukung harus pdf, jpg, jpeg, doc, atau docx',
                'supporting_file.max' => 'Ukuran file pendukung maksimal 500KB',
            ]);

            // Store the files
            if ($request->hasFile('certificate_file')) {
                $certificatePath = $request->file('certificate_file')->store('achievements', 'public');
                $validated['certificate_file'] = $certificatePath;
            }

            if ($request->hasFile('supporting_file')) {
                $supportingPath = $request->file('supporting_file')->store('achievements', 'public');
                $validated['supporting_file'] = $supportingPath;
            }

            $achievement = CandidatesAchievements::create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
                'level' => $validated['level'],
                'month' => $validated['month'],
                'year' => $validated['year'],
                'description' => $validated['description'],
                'certificate_file' => $validated['certificate_file'] ?? null,
                'supporting_file' => $validated['supporting_file'] ?? null,
            ]);

            return response()->json([
                'message' => 'Data berhasil disimpan!',
                'data' => $achievement
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error saving achievement: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateAchievement(Request $request, $id)
    {
        try {
            $achievement = CandidatesAchievements::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'level' => 'required|string|in:Internasional,Nasional,Regional,Lokal',
                'month' => 'required|string',
                'year' => 'required|string',
                'description' => 'required|string|min:10',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,doc,docx|max:500',
                'supporting_file' => 'nullable|file|mimes:pdf,jpg,jpeg,doc,docx|max:500',
            ]);

            if ($request->hasFile('certificate_file')) {
                // Delete old file
                if ($achievement->certificate_file) {
                    Storage::disk('public')->delete($achievement->certificate_file);
                }
                $certificatePath = $request->file('certificate_file')->store('achievements', 'public');
                $validated['certificate_file'] = $certificatePath;
            }

            if ($request->hasFile('supporting_file')) {
                // Delete old file
                if ($achievement->supporting_file) {
                    Storage::disk('public')->delete($achievement->supporting_file);
                }
                $supportingPath = $request->file('supporting_file')->store('achievements', 'public');
                $validated['supporting_file'] = $supportingPath;
            }

            $achievement->update($validated);

            return response()->json([
                'message' => 'Data berhasil diperbarui!',
                'data' => $achievement
            ]);

        } catch (\Exception $e) {
            \Log::error('Error updating achievement: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan saat memperbarui data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function indexAchievements()
    {
        try {
            $achievements = CandidatesAchievements::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $achievements
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching achievements: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengambil data prestasi'
            ], 500);
        }
    }

    public function showAchievement($id)
    {
        try {
            $achievement = CandidatesAchievements::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            return response()->json([
                'status' => 'success',
                'data' => $achievement
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }
    }

    public function indexSocialMedia()
    {
        $socialMedia = CandidatesSocialMedia::where('user_id', auth()->id())->get();

        return response()->json([
            'status' => 'success',
            'data' => $socialMedia
        ]);
    }

    public function storeSocialMedia(Request $request)
    {
        $validated = $request->validate([
            'platform_name' => 'required|string',
            'url' => 'required|url'
        ]);

        $validated['user_id'] = auth()->id();

        CandidatesSocialMedia::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Social media berhasil ditambahkan'
        ]);
    }

    public function updateSocialMedia(Request $request, $id)
    {
        $validated = $request->validate([
            'platform_name' => 'required|string',
            'url' => 'required|url'
        ]);

        $socialMedia = CandidatesSocialMedia::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $socialMedia->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Social media berhasil diperbarui'
        ]);
    }

    public function storeEnglishCertification(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255', // Field 'name'
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048'
            ]);

            $data = [
                'user_id' => Auth::id(),
                'name' => $request->name, // Pastikan menggunakan 'name'
            ];

            if ($request->hasFile('certificate_file')) {
                $file = $request->file('certificate_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('english-certifications/certificates', $filename, 'public');
                $data['certificate_file'] = $path;
            }

            $englishCertification = EnglishCertifications::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Sertifikat bahasa Inggris berhasil disimpan',
                'data' => $englishCertification
            ]);

        } catch (\Exception $e) {
            \Log::error('Error storing english certification', [
                'message' => $e->getMessage(),
                'data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan sertifikat: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkDataCompleteness()
    {
        try {
            $userId = Auth::id();
            $user = Auth::user();
            
            $completeness = [
                'profile' => false,
                'education' => false,
                'skills' => false,
                'work_experience' => false,
                'achievements' => false,
                'languages' => false,
                'english_certifications' => false,
                'overall_complete' => false
            ];
            
            // Cek data pribadi
            $profile = CandidatesProfiles::where('user_id', $userId)->first();
            $completeness['profile'] = $profile && $profile->phone_number && $profile->address && $profile->date_of_birth;
            
            // Cek pendidikan
            $education = CandidatesEducations::where('user_id', $userId)->first();
            $completeness['education'] = (bool) $education;
            
            // Cek skills
            $skillsCount = Skills::where('user_id', $userId)->count();
            $completeness['skills'] = $skillsCount > 0;
            
            // Cek pengalaman kerja (opsional)
            $workExpCount = CandidatesWorkExperiences::where('user_id', $userId)->count();
            $completeness['work_experience'] = $workExpCount > 0;
            
            // Cek prestasi (opsional)
            $achievementCount = CandidatesAchievements::where('user_id', $userId)->count();
            $completeness['achievements'] = $achievementCount > 0;
            
            // Cek bahasa (opsional)
            $languagesCount = Languages::where('user_id', $userId)->count();
            $completeness['languages'] = $languagesCount > 0;
            
            // Cek sertifikat bahasa inggris (opsional)
            $englishCertCount = EnglishCertifications::where('user_id', $userId)->count();
            $completeness['english_certifications'] = $englishCertCount > 0;
            
            // Overall completeness (minimal profile, education, skills)
            $completeness['overall_complete'] = $completeness['profile'] && 
                                               $completeness['education'] && 
                                               $completeness['skills'];
            
            // Cek apakah sudah ada CV yang pernah digenerate
            $existingCV = CandidateCV::where('user_id', $userId)
                                     ->where('is_active', true)
                                     ->first();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'completeness' => $completeness,
                    'has_existing_cv' => (bool) $existingCV,
                    'existing_cv' => $existingCV ? [
                        'filename' => $existingCV->cv_filename,
                        'created_at' => $existingCV->formatted_created_at,
                        'download_count' => $existingCV->download_count
                    ] : null
                ]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error checking data completeness: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal cek kelengkapan data'
            ], 500);
        }
    }

    public function generateCV()
    {
        try {
            $userId = Auth::id();
            $user = Auth::user();
            
            \Log::info('Starting CV generation for user: ' . $userId);
            
            if (!$user) {
                throw new \Exception('User not authenticated');
            }

            // Validasi data terlebih dahulu
            $this->validateUserDataForCV($userId);

            // Ambil semua data user dengan fallback empty collection
            $profile = CandidatesProfiles::where('user_id', $userId)->first();
            $education = CandidatesEducations::where('user_id', $userId)->first();
            $workExperiences = CandidatesWorkExperiences::where('user_id', $userId)
                ->orderBy('start_year', 'desc')
                ->orderBy('start_month', 'desc')
                ->get();
            $organizations = CandidatesOrganizations::where('user_id', $userId)
                ->orderBy('start_year', 'desc')
                ->get();
            $achievements = CandidatesAchievements::where('user_id', $userId)
                ->orderBy('year', 'desc')
                ->get();
            $skills = Skills::where('user_id', $userId)->get();
            $courses = Courses::where('user_id', $userId)->get();
            $certifications = Certifications::where('user_id', $userId)->get();
            $languages = Languages::where('user_id', $userId)->get();
            $englishCertifications = EnglishCertifications::where('user_id', $userId)->get();
            $socialMedia = CandidatesSocialMedia::where('user_id', $userId)->get();

            // Data untuk PDF
            $data = [
                'user' => $user,
                'profile' => $profile,
                'education' => $education,
                'workExperiences' => $workExperiences,
                'organizations' => $organizations,
                'achievements' => $achievements,
                'skills' => $skills,
                'courses' => $courses,
                'certifications' => $certifications,
                'languages' => $languages,
                'englishCertifications' => $englishCertifications,
                'socialMedia' => $socialMedia,
            ];

            \Log::info('Data collected for CV generation', [
                'user_id' => $userId,
                'profile_exists' => !!$profile,
                'education_exists' => !!$education,
                'skills_count' => $skills->count(),
                'work_exp_count' => $workExperiences->count()
            ]);

            // Generate PDF
            $pdf = Pdf::loadView('cv.template', $data);
            $pdf->setPaper('A4', 'portrait');
            
            // Generate PDF content
            $pdfContent = $pdf->output();
            
            \Log::info('PDF generated successfully', [
                'user_id' => $userId,
                'pdf_size' => strlen($pdfContent)
            ]);
            
            // Nama file yang aman
            $userName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $user->name ?? 'User');
            $fileName = 'CV_' . $userName . '_' . date('Y-m-d_H-i-s') . '.pdf';
            $filePath = 'cvs/' . $fileName;
            
            // Pastikan direktori ada
            if (!Storage::disk('public')->exists('cvs')) {
                Storage::disk('public')->makeDirectory('cvs');
            }
            
            // Simpan PDF ke storage
            Storage::disk('public')->put($filePath, $pdfContent);
            
            \Log::info('PDF saved to storage', [
                'user_id' => $userId,
                'file_path' => $filePath
            ]);
            
            // Nonaktifkan CV lama jika ada
            CandidateCV::where('user_id', $userId)->update(['is_active' => false]);
            
            // Simpan info CV baru ke database
            $cvRecord = CandidateCV::create([
                'user_id' => $userId,
                'cv_filename' => $fileName,
                'cv_path' => $filePath,
                'download_count' => 0, // Set ke 0 karena belum di-download
                'last_downloaded_at' => null, // Set ke null karena belum di-download
                'cv_data_snapshot' => $data,
                'is_active' => true
            ]);

            \Log::info('CV record saved successfully', [
                'user_id' => $userId,
                'cv_id' => $cvRecord->id
            ]);

            // Generate download URL
            $downloadUrl = route('candidate.cv.download', $cvRecord->id);

            // Return JSON response instead of PDF
            return response()->json([
                'success' => true,
                'message' => 'CV berhasil digenerate!',
                'data' => [
                    'cv_id' => $cvRecord->id,
                    'filename' => $fileName,
                    'created_at' => $cvRecord->created_at->format('d/m/Y H:i'),
                    'download_url' => $downloadUrl,
                    'file_size' => $this->formatBytes(strlen($pdfContent))
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error generating CV', [
                'user_id' => $userId ?? null,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Return JSON error response
            return response()->json([
                'success' => false,
                'message' => 'Gagal generate CV: ' . $e->getMessage(),
                'error_details' => [
                    'file' => basename($e->getFile()),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }

    // Tambahkan helper method untuk format file size
    private function formatBytes($size, $precision = 2)
    {
        $base = log($size, 1024);
        $suffixes = array('', 'KB', 'MB', 'GB', 'TB');   
        return round(pow(1024, $base - floor($base)), $precision) .' '. $suffixes[floor($base)];
    }

    public function downloadCV($id = null)
    {
        try {
            $userId = Auth::id();
            
            if ($id) {
                // Download specific CV by ID
                $cv = CandidateCV::where('id', $id)
                                 ->where('user_id', $userId)
                                 ->firstOrFail();
            } else {
                // Download latest active CV
                $cv = CandidateCV::where('user_id', $userId)
                                 ->where('is_active', true)
                                 ->first();
                
                if (!$cv) {
                    return response()->json(['error' => 'CV not found'], 404);
                }
            }
            
            // Check if file exists
            if (!Storage::disk('public')->exists($cv->cv_path)) {
                return response()->json(['error' => 'CV file not found'], 404);
            }
            
            // Update download count
            $cv->increment('download_count');
            $cv->update(['last_downloaded_at' => now()]);
            
            // Return file download
            return Storage::disk('public')->download($cv->cv_path, $cv->cv_filename);
            
        } catch (\Exception $e) {
            \Log::error('Download CV error: ' . $e->getMessage());
            return response()->json(['error' => 'Download failed'], 500);
        }
    }

    public function listUserCVs()
    {
        try {
            $userId = Auth::id();
            $cvs = CandidateCV::where('user_id', $userId)
                          ->orderBy('created_at', 'desc')
                          ->get();
            
            return response()->json([
                'success' => true,
                'data' => $cvs
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error listing CVs: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil daftar CV'
            ], 500);
        }
    }

    public function deleteCV($id)
    {
        try {
            $userId = Auth::id();
            $cv = CandidateCV::where('id', $id)
                         ->where('user_id', $userId)
                         ->firstOrFail();
            
            // Delete file from storage
            if (Storage::disk('public')->exists($cv->cv_path)) {
                Storage::disk('public')->delete($cv->cv_path);
            }
            
            // Delete record from database
            $cv->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'CV berhasil dihapus'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error deleting CV: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus CV'
            ], 500);
        }
    }

    private function validateUserDataForCV($userId)
    {
        $errors = [];
        
        // Cek data pribadi
        $profile = CandidatesProfiles::where('user_id', $userId)->first();
        if (!$profile) {
            $errors[] = 'Data pribadi belum dilengkapi';
        } else {
            if (!$profile->phone_number) $errors[] = 'Nomor telepon belum diisi';
            if (!$profile->address) $errors[] = 'Alamat belum diisi';
            if (!$profile->date_of_birth) $errors[] = 'Tanggal lahir belum diisi';
        }
        
        // Cek data pendidikan
        $education = CandidatesEducations::where('user_id', $userId)->first();
        if (!$education) {
            $errors[] = 'Data pendidikan belum dilengkapi';
        }
        
        // Cek minimal ada 1 skill
        $skillsCount = Skills::where('user_id', $userId)->count();
        if ($skillsCount == 0) {
            $errors[] = 'Minimal harus menambahkan 1 skill/kemampuan';
        }
        
        if (!empty($errors)) {
            throw new \Exception('Data belum lengkap untuk generate CV: ' . implode(', ', $errors));
        }
    }

    // Method untuk test PDF generation
    public function testPDF()
    {
        try {
            \Log::info('Testing PDF generation');
            
            $html = '<h1>Test PDF</h1><p>This is a test PDF generation at ' . now() . '</p>';
            $pdf = Pdf::loadHTML($html);
            $content = $pdf->output();
            
            \Log::info('Test PDF generated successfully', ['size' => strlen($content)]);
            
            return response($content, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="test_' . date('Y-m-d_H-i-s') . '.pdf"',
                'Content-Length' => strlen($content)
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Test PDF generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function indexSkills()
    {
        try {
            $skills = Skills::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $skills
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching skills: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data skills'
            ], 500);
        }
    }

    public function storeSkill(Request $request)
    {
        try {
            $validated = $request->validate([
                'skill_name' => 'required|string|max:255',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048', // 2MB max
            ], [
                'skill_name.required' => 'Nama skill harus diisi',
                'skill_name.max' => 'Nama skill maksimal 255 karakter',
                'certificate_file.mimes' => 'Format file harus pdf, jpg, jpeg, png, doc, atau docx',
                'certificate_file.max' => 'Ukuran file maksimal 2MB',
            ]);

            $data = [
                'user_id' => Auth::id(),
                'skill_name' => $validated['skill_name'],
            ];

            // Handle file upload jika ada
            if ($request->hasFile('certificate_file')) {
                $file = $request->file('certificate_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('skills/certificates', $filename, 'public');
                $data['certificate_file'] = $path;
            }

            $skill = Skills::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Skill berhasil disimpan!',
                'data' => $skill
            ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Error storing skill', [
            'message' => $e->getMessage(),
            'user_id' => Auth::id(),
            'data' => $request->all()
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Gagal menyimpan skill: ' . $e->getMessage()
        ], 500);
    }
}

public function updateSkill(Request $request, $id)
{
    try {
        $skill = Skills::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'skill_name' => 'required|string|max:255',
            'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048',
        ], [
            'skill_name.required' => 'Nama skill harus diisi',
            'skill_name.max' => 'Nama skill maksimal 255 karakter',
            'certificate_file.mimes' => 'Format file harus pdf, jpg, jpeg, png, doc, atau docx',
            'certificate_file.max' => 'Ukuran file maksimal 2MB',
        ]);

        $data = [
            'skill_name' => $validated['skill_name'],
        ];

        // Handle file upload jika ada
        if ($request->hasFile('certificate_file')) {
            // Delete old file if exists
            if ($skill->certificate_file) {
                Storage::disk('public')->delete($skill->certificate_file);
            }
            
            $file = $request->file('certificate_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('skills/certificates', $filename, 'public');
            $data['certificate_file'] = $path;
        }

        $skill->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Skill berhasil diperbarui!',
            'data' => $skill
        ]);

    } catch (\Exception $e) {
        \Log::error('Error updating skill: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal memperbarui skill'
        ], 500);
    }
}

public function deleteSkill($id)
{
    try {
        $skill = Skills::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Delete file if exists
        if ($skill->certificate_file) {
            Storage::disk('public')->delete($skill->certificate_file);
        }

        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill berhasil dihapus!'
        ]);

    } catch (\Exception $e) {
        \Log::error('Error deleting skill: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal menghapus skill'
        ], 500);
    }
}

// Methods untuk Languages
public function indexLanguages()
{
    try {
        $languages = Languages::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $languages
        ]);
    } catch (\Exception $e) {
        \Log::error('Error fetching languages: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengambil data bahasa'
        ], 500);
    }
}

public function storeLanguage(Request $request)
{
    try {
        $validated = $request->validate([
            'language_name' => 'required|string|max:255',
            'proficiency_level' => 'nullable|string|in:Beginner,Intermediate,Advanced,Native',
        ], [
            'language_name.required' => 'Nama bahasa harus diisi',
            'language_name.max' => 'Nama bahasa maksimal 255 karakter',
            'proficiency_level.in' => 'Level kemahiran tidak valid',
        ]);

        $language = Languages::create([
            'user_id' => Auth::id(),
            'language_name' => $validated['language_name'],
            'proficiency_level' => $validated['proficiency_level'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bahasa berhasil disimpan!',
            'data' => $language
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Error storing language: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal menyimpan bahasa'
        ], 500);
    }
}

public function updateLanguage(Request $request, $id)
{
    try {
        $language = Languages::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'language_name' => 'required|string|max:255',
            'proficiency_level' => 'nullable|string|in:Beginner,Intermediate,Advanced,Native',
        ]);

        $language->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Bahasa berhasil diperbarui!',
            'data' => $language
        ]);

    } catch (\Exception $e) {
        \Log::error('Error updating language: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal memperbarui bahasa'
        ], 500);
    }
}

public function deleteLanguage($id)
{
    try {
        $language = Languages::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $language->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bahasa berhasil dihapus!'
        ]);

    } catch (\Exception $e) {
        \Log::error('Error deleting language: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal menghapus bahasa'
        ], 500);
    }
}

// Methods untuk Courses
public function indexCourses()
{
    try {
        $courses = Courses::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    } catch (\Exception $e) {
        \Log::error('Error fetching courses: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengambil data kursus'
        ], 500);
    }
}

public function storeCourse(Request $request)
{
    try {
        $validated = $request->validate([
            'course_name' => 'required|string|max:255',
            'institution' => 'nullable|string|max:255',
            'completion_date' => 'nullable|date',
            'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048',
        ]);

        $data = [
            'user_id' => Auth::id(),
            'course_name' => $validated['course_name'],
            'institution' => $validated['institution'] ?? null,
            'completion_date' => $validated['completion_date'] ?? null,
        ];

        if ($request->hasFile('certificate_file')) {
            $file = $request->file('certificate_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('courses/certificates', $filename, 'public');
            $data['certificate_file'] = $path;
        }

        $course = Courses::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Kursus berhasil disimpan!',
            'data' => $course
        ], 201);

    } catch (\Exception $e) {
        \Log::error('Error storing course: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal menyimpan kursus'
        ], 500);
    }
}

// Methods untuk Certifications
public function indexCertifications()
{
    try {
        $certifications = Certifications::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $certifications
        ]);
    } catch (\Exception $e) {
        \Log::error('Error fetching certifications: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengambil data sertifikasi'
        ], 500);
    }
}

public function storeCertification(Request $request)
{
    try {
        $validated = $request->validate([
            'certification_name' => 'required|string|max:255',
            'issuing_organization' => 'nullable|string|max:255',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048',
        ]);

        $data = [
            'user_id' => Auth::id(),
            'certification_name' => $validated['certification_name'],
            'issuing_organization' => $validated['issuing_organization'] ?? null,
            'issue_date' => $validated['issue_date'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
        ];

        if ($request->hasFile('certificate_file')) {
            $file = $request->file('certificate_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('certifications/certificates', $filename, 'public');
            $data['certificate_file'] = $path;
        }

        $certification = Certifications::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Sertifikasi berhasil disimpan!',
            'data' => $certification
        ], 201);

    } catch (\Exception $e) {
        \Log::error('Error storing certification: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal menyimpan sertifikasi'
        ], 500);
    }
}

// Methods untuk English Certifications
public function indexEnglishCertifications()
{
    try {
        $englishCertifications = EnglishCertifications::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $englishCertifications
        ]);
    } catch (\Exception $e) {
        \Log::error('Error fetching english certifications: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengambil data sertifikat bahasa Inggris'
        ], 500);
    }
}
}
