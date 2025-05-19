<?php

namespace App\Http\Controllers;

use App\Models\CandidatesProfiles;
use App\Models\CandidatesEducations;
use App\Models\CandidatesWorkExperiences;
use App\Models\UserWorkExperiences;
use App\Models\WorkExperience;
use App\Models\CandidatesOrganizations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CandidateController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        return Inertia::render('candidate/dashboard/candidate-dashboard', [
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
        $validated = $request->validate([
            'organization_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'is_active' => 'required|boolean',
            'start_year' => 'required|integer|min:1900|max:' . date('Y'),
            'end_year' => 'nullable|integer|min:1900|max:' . date('Y'),
        ]);

        $validated['user_id'] = Auth::id();

        $organization = CandidatesOrganizations::create($validated);

        return response()->json([
            'message' => 'Data berhasil disimpan!',
            'data' => $organization,
        ], 201);
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
}
