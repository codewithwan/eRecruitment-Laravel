<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
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

    public function store()
    {
        return Inertia::render('candidate/profile/candidate-profile');
    }

    public function show()
    {
        // $candidates = Candidate::all();
        return Inertia::render('admin/candidates/candidate-list');
    }
}
