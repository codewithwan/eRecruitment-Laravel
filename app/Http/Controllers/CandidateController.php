<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
// use Illuminate\Support\Facades\Log;

class CandidateController extends Controller
{
    public function index()
    {

        $AuthUser = Auth::user();
        // Log::info($AuthUser);
        return Inertia::render('candidate/candidate-dashboard', ['users' => $AuthUser]);
    }

    public function store()
    {
        return Inertia::render('candidate/profile/candidate-profile');
    }
}
