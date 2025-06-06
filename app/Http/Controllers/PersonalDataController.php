<?php

namespace App\Http\Controllers;

use App\Models\CandidatesEducations;
use App\Models\MasterMajor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PersonalDataController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $education = CandidatesEducations::where('user_id', $user->id)->first();
        $majors = MasterMajor::all();

        // Cek CV
        $hasCV = Storage::disk('public')->exists('cv/'.$user->id.'.pdf');

        // Ambil URL redirect_back jika ada
        $redirectBack = $request->query('redirect_back');

        return Inertia::render('candidate/profile/personal-data', [
            'user' => $user,
            'education' => $education,
            'majors' => $majors,
            'hasCV' => $hasCV,
            'redirectBack' => $redirectBack,
            'isComplete' => $this->isProfileComplete($user),
        ]);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'required|string|max:15',
            'address' => 'required|string',
            'institution' => 'required|string',
            'major_id' => 'required|exists:master_majors,id',
            'year_graduated' => 'required|integer',
            'cv' => 'sometimes|file|mimes:pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Update data user
        $user = Auth::user();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone_number = $request->phone_number;
        $user->address = $request->address;
        $user->save();

        // Update atau buat data pendidikan
        $education = CandidatesEducations::updateOrCreate(
            ['user_id' => $user->id],
            [
                'institution' => $request->institution,
                'major_id' => $request->major_id,
                'year_graduated' => $request->year_graduated
            ]
        );

        // Handle CV upload
        if ($request->hasFile('cv')) {
            $file = $request->file('cv');
            $filename = $user->id.'.pdf';

            // Simpan file CV
            $file->storeAs('cv', $filename, 'public');
        }

        // Jika ada redirectBack URL
        if ($request->redirect_back) {
            return redirect($request->redirect_back)->with('success', 'Data pribadi berhasil diperbarui!');
        }

        return back()->with('success', 'Data pribadi berhasil diperbarui!');
    }

    private function isProfileComplete($user)
    {
        // Cek data pribadi dasar
        if (empty($user->name) || empty($user->email) || empty($user->phone_number) || empty($user->address)) {
            return false;
        }

        // Cek pendidikan
        $education = CandidatesEducations::where('user_id', $user->id)->first();
        if (!$education || empty($education->institution) || empty($education->major_id) || empty($education->year_graduated)) {
            return false;
        }

        // Cek CV
        $hasCV = Storage::disk('public')->exists('cv/'.$user->id.'.pdf');
        if (!$hasCV) {
            return false;
        }

        return true;
    }
}
