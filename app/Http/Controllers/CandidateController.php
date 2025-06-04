<?php

namespace App\Http\Controllers;

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
use App\Models\Languages; // Pastikan import ini ada
use App\Models\EnglishCertifications; // Pastikan import ini ada
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CandidateController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('candidate/candidate-dashboard', [
            'users' => $user,
        ]);
    }

    public function profile()
    {
        $user = Auth::user();
        $profile = CandidatesProfiles::where('user_id', $user->id)->first();

        return Inertia::render('DataPribadiForm', [
            'profile' => $profile,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
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
        $experiences = UserWorkExperiences::where('user_id', Auth::id())->get();
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
        $experience = WorkExperience::where('id', $id)
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
            \Log::info('Store Achievement Request', $request->all());
            
            $request->validate([
                'title' => 'required|string|max:255',
                'level' => 'required|string|max:100',
                'month' => 'required|string|max:20',
                'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
                'description' => 'required|string|min:10',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:512', // 512KB
                'supporting_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:512'
            ]);

            $data = [
                'user_id' => Auth::id(),
                'title' => $request->title,
                'level' => $request->level,
                'month' => $request->month,
                'year' => $request->year,
                'description' => $request->description,
            ];

            // Handle certificate file
            if ($request->hasFile('certificate_file')) {
                $file = $request->file('certificate_file');
                $filename = time() . '_cert_' . $file->getClientOriginalName();
                $path = $file->storeAs('achievements/certificates', $filename, 'public');
                $data['certificate_file'] = $path;
            }

            // Handle supporting file
            if ($request->hasFile('supporting_file')) {
                $file = $request->file('supporting_file');
                $filename = time() . '_supp_' . $file->getClientOriginalName();
                $path = $file->storeAs('achievements/supporting', $filename, 'public');
                $data['supporting_file'] = $path;
            }

            $achievement = CandidatesAchievements::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Achievement berhasil disimpan',
                'data' => $achievement
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in achievement', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error storing achievement: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan achievement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateAchievement(Request $request, $id)
    {
        try {
            \Log::info('Update Achievement Request', [
                'id' => $id,
                'data' => $request->all()
            ]);

            $request->validate([
                'title' => 'required|string|max:255',
                'level' => 'required|string|max:100',
                'month' => 'required|string|max:20',
                'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
                'description' => 'required|string|min:10',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:512',
                'supporting_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:512'
            ]);

            $achievement = CandidatesAchievements::where('id', $id)
                      ->where('user_id', Auth::id())
                      ->first();

            if (!$achievement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Achievement tidak ditemukan'
                ], 404);
            }

            $data = [
                'title' => $request->title,
                'level' => $request->level,
                'month' => $request->month,
                'year' => $request->year,
                'description' => $request->description,
            ];

            // Handle certificate file
            if ($request->hasFile('certificate_file')) {
                // Delete old file
                if ($achievement->certificate_file && Storage::disk('public')->exists($achievement->certificate_file)) {
                    Storage::disk('public')->delete($achievement->certificate_file);
                }

                $file = $request->file('certificate_file');
                $filename = time() . '_cert_' . $file->getClientOriginalName();
                $path = $file->storeAs('achievements/certificates', $filename, 'public');
                $data['certificate_file'] = $path;
            }

            // Handle supporting file
            if ($request->hasFile('supporting_file')) {
                // Delete old file
                if ($achievement->supporting_file && Storage::disk('public')->exists($achievement->supporting_file)) {
                    Storage::disk('public')->delete($achievement->supporting_file);
                }

                $file = $request->file('supporting_file');
                $filename = time() . '_supp_' . $file->getClientOriginalName();
                $path = $file->storeAs('achievements/supporting', $filename, 'public');
                $data['supporting_file'] = $path;
            }

            $achievement->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Achievement berhasil diupdate',
                'data' => $achievement
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in update achievement', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error updating achievement: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate achievement: ' . $e->getMessage()
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

    /**
     * Menampilkan daftar skill user
     */
    public function indexSkills()
    {
        try {
            $skills = Skills::where('user_id', Auth::id())->get();
            
            return response()->json([
                'success' => true,
                'data' => $skills
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data skills'
            ], 500);
        }
    }

    /**
     * Menyimpan skill baru
     */
    public function storeSkill(Request $request)
    {
        try {
            $request->validate([
                'skill_name' => 'required|string|max:255',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048'
            ]);

            $data = [
                'user_id' => Auth::id(),
                'skill_name' => $request->skill_name,
            ];

            // Handle file upload
            if ($request->hasFile('certificate_file')) {
                $file = $request->file('certificate_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('skills/certificates', $filename, 'public');
                $data['certificate_file'] = $path;
            }

            $skill = Skills::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Skill berhasil disimpan',
                'data' => $skill
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan skill: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hapus skill
     */
    public function deleteSkill($id)
    {
        try {
            $skill = Skills::where('id', $id)
                          ->where('user_id', Auth::id())
                          ->first();

            if (!$skill) {
                return response()->json([
                    'success' => false,
                    'message' => 'Skill tidak ditemukan'
                ], 404);
            }

            // Delete file if exists
            if ($skill->certificate_file && Storage::disk('public')->exists($skill->certificate_file)) {
                Storage::disk('public')->delete($skill->certificate_file);
            }

            $skill->delete();

            return response()->json([
                'success' => true,
                'message' => 'Skill berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus skill'
            ], 500);
        }
    }

    /**
     * Update an existing skill
     */
    public function updateSkill(Request $request, $id)
    {
        try {
            $request->validate([
                'skill_name' => 'required|string|max:255',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048'
            ]);

            $skill = Skills::where('id', $id)
                      ->where('user_id', Auth::id())
                      ->first();

            if (!$skill) {
                return response()->json([
                    'success' => false,
                    'message' => 'Skill tidak ditemukan'
                ], 404);
            }

            $data = [
                'skill_name' => $request->skill_name,
            ];

            // Handle file upload
            if ($request->hasFile('certificate_file')) {
                // Delete old file if exists
                if ($skill->certificate_file && Storage::disk('public')->exists($skill->certificate_file)) {
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
                'message' => 'Skill berhasil diupdate',
                'data' => $skill
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate skill: ' . $e->getMessage()
            ], 500);
        }
    }

    // COURSE METHODS - Menggunakan Courses (plural)
    public function indexCourses()
    {
        try {
            $courses = Courses::where('user_id', Auth::id())->get();
            
            return response()->json([
                'success' => true,
                'data' => $courses
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kursus'
            ], 500);
        }
    }

    public function storeCourse(Request $request)
    {
        try {
            $request->validate([
                'course_name' => 'required|string|max:255',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048'
            ]);

            $data = [
                'user_id' => Auth::id(),
                'course_name' => $request->course_name,
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
                'message' => 'Kursus berhasil disimpan',
                'data' => $course
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan kursus: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateCourse(Request $request, $id)
    {
        try {
            $request->validate([
                'course_name' => 'required|string|max:255',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048'
            ]);

            $course = Courses::where('id', $id)
                      ->where('user_id', Auth::id())
                      ->first();

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kursus tidak ditemukan'
                ], 404);
            }

            $data = [
                'course_name' => $request->course_name,
            ];

            if ($request->hasFile('certificate_file')) {
                if ($course->certificate_file && Storage::disk('public')->exists($course->certificate_file)) {
                    Storage::disk('public')->delete($course->certificate_file);
                }

                $file = $request->file('certificate_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('courses/certificates', $filename, 'public');
                $data['certificate_file'] = $path;
            }

            $course->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Kursus berhasil diupdate',
                'data' => $course
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate kursus: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteCourse($id)
    {
        try {
            $course = Courses::where('id', $id)
                          ->where('user_id', Auth::id())
                          ->first();

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kursus tidak ditemukan'
                ], 404);
            }

            if ($course->certificate_file && Storage::disk('public')->exists($course->certificate_file)) {
                Storage::disk('public')->delete($course->certificate_file);
            }

            $course->delete();

            return response()->json([
                'success' => true,
                'message' => 'Kursus berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus kursus'
            ], 500);
        }
    }

    // CERTIFICATION METHODS - Menggunakan Certifications (plural)
    public function indexCertifications()
    {
        try {
            $certifications = Certifications::where('user_id', Auth::id())->get();
            
            return response()->json([
                'success' => true,
                'data' => $certifications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data sertifikasi'
            ], 500);
        }
    }

    public function storeCertification(Request $request)
    {
        try {
            $request->validate([
                'certification_name' => 'required|string|max:255',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048'
            ]);

            $data = [
                'user_id' => Auth::id(),
                'certification_name' => $request->certification_name,
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
                'message' => 'Sertifikasi berhasil disimpan',
                'data' => $certification
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan sertifikasi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateCertification(Request $request, $id)
    {
        try {
            $request->validate([
                'certification_name' => 'required|string|max:255',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048'
            ]);

            $certification = Certifications::where('id', $id)
                      ->where('user_id', Auth::id())
                      ->first();

            if (!$certification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sertifikasi tidak ditemukan'
                ], 404);
            }

            $data = [
                'certification_name' => $request->certification_name,
            ];

            if ($request->hasFile('certificate_file')) {
                if ($certification->certificate_file && Storage::disk('public')->exists($certification->certificate_file)) {
                    Storage::disk('public')->delete($certification->certificate_file);
                }

                $file = $request->file('certificate_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('certifications/certificates', $filename, 'public');
                $data['certificate_file'] = $path;
            }

            $certification->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Sertifikasi berhasil diupdate',
                'data' => $certification
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate sertifikasi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteCertification($id)
    {
        try {
            $certification = Certifications::where('id', $id)
                          ->where('user_id', Auth::id())
                          ->first();

            if (!$certification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sertifikasi tidak ditemukan'
                ], 404);
            }

            if ($certification->certificate_file && Storage::disk('public')->exists($certification->certificate_file)) {
                Storage::disk('public')->delete($certification->certificate_file);
            }

            $certification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sertifikasi berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus sertifikasi'
            ], 500);
        }
    }

    // LANGUAGE METHODS
    public function indexLanguages()
    {
        try {
            $languages = Languages::where('user_id', Auth::id())->get();
            
            return response()->json([
                'success' => true,
                'data' => $languages
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data bahasa'
            ], 500);
        }
    }

    public function storeLanguage(Request $request)
    {
        try {
            $request->validate([
                'language_name' => 'required|string|max:255',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048'
            ]);

            $data = [
                'user_id' => Auth::id(),
                'language_name' => $request->language_name,
            ];

            if ($request->hasFile('certificate_file')) {
                $file = $request->file('certificate_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('languages/certificates', $filename, 'public');
                $data['certificate_file'] = $path;
            }

            $language = Languages::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Bahasa berhasil disimpan',
                'data' => $language
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan bahasa: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateLanguage(Request $request, $id)
    {
        try {
            $request->validate([
                'language_name' => 'required|string|max:255',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048'
            ]);

            $language = Languages::where('id', $id)
                      ->where('user_id', Auth::id())
                      ->first();

            if (!$language) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bahasa tidak ditemukan'
                ], 404);
            }

            $data = [
                'language_name' => $request->language_name,
            ];

            if ($request->hasFile('certificate_file')) {
                if ($language->certificate_file && Storage::disk('public')->exists($language->certificate_file)) {
                    Storage::disk('public')->delete($language->certificate_file);
                }

                $file = $request->file('certificate_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('languages/certificates', $filename, 'public');
                $data['certificate_file'] = $path;
            }

            $language->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Bahasa berhasil diupdate',
                'data' => $language
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate bahasa: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteLanguage($id)
    {
        try {
            $language = Languages::where('id', $id)
                          ->where('user_id', Auth::id())
                          ->first();

            if (!$language) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bahasa tidak ditemukan'
                ], 404);
            }

            if ($language->certificate_file && Storage::disk('public')->exists($language->certificate_file)) {
                Storage::disk('public')->delete($language->certificate_file);
            }

            $language->delete();

            return response()->json([
                'success' => true,
                'message' => 'Bahasa berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus bahasa'
            ], 500);
        }
    }

    // ENGLISH CERTIFICATION METHODS
    public function indexEnglishCertifications()
    {
        try {
            $englishCertifications = EnglishCertifications::where('user_id', Auth::id())->get();
            
            return response()->json([
                'success' => true,
                'data' => $englishCertifications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data sertifikat bahasa Inggris'
            ], 500);
        }
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

    public function updateEnglishCertification(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048'
            ]);

            $englishCertification = EnglishCertifications::where('id', $id)
                      ->where('user_id', Auth::id())
                      ->first();

            if (!$englishCertification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sertifikat tidak ditemukan'
                ], 404);
            }

            $data = [
                'name' => $request->name,
            ];

            if ($request->hasFile('certificate_file')) {
                // Delete old file if exists
                if ($englishCertification->certificate_file && Storage::disk('public')->exists($englishCertification->certificate_file)) {
                    Storage::disk('public')->delete($englishCertification->certificate_file);
                }

                // Store new file
                $file = $request->file('certificate_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('english-certifications/certificates', $filename, 'public');
                $data['certificate_file'] = $path;
            }

            $englishCertification->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Sertifikat berhasil diupdate',
                'data' => $englishCertification
            ]);

        } catch (\Exception $e) {
            \Log::error('Error updating english certification: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate sertifikat: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteEnglishCertification($id)
    {
        try {
            $englishCertification = EnglishCertifications::where('id', $id)
                          ->where('user_id', Auth::id())
                          ->first();

            if (!$englishCertification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sertifikat tidak ditemukan'
                ], 404);
            }

            // Delete file if exists
            if ($englishCertification->certificate_file && Storage::disk('public')->exists($englishCertification->certificate_file)) {
                Storage::disk('public')->delete($englishCertification->certificate_file);
            }

            // Delete record
            $englishCertification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sertifikat berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error deleting english certification: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus sertifikat: ' . $e->getMessage()
            ], 500);
        }
    }
}
