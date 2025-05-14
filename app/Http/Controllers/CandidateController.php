<?php

namespace App\Http\Controllers;

use App\Models\CandidatesProfiles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        
        if ($profile) {
            $profile->date_of_birth = date('Y-m-d', strtotime($profile->date_of_birth));
        }

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
            DB::beginTransaction();

            $validated = $request->validate([
                'no_ektp' => 'required|string|max:16',
                'gender' => 'required|in:male,female',
                'phone_number' => 'required|string',
                'npwp' => 'nullable|string',
                'about_me' => 'required|string|min:200',
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

            $user = Auth::user();
            
            // Update or create the profile
            $profile = CandidatesProfiles::updateOrCreate(
                ['user_id' => $user->id],
                $validated
            );

            DB::commit();

            // Return with both success message and updated profile
            return redirect()->back()->with([
                'success' => 'Data pribadi berhasil disimpan',
                'profile' => $profile
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error saving profile: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan data');
        }
    }

    public function show()
    {
        return Inertia::render('admin/candidates/candidate-list');
    }
}
