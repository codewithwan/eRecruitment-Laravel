<?php

use App\Enums\UserRole;
use App\Http\Controllers\CandidateController;
use Illuminate\Support\Facades\Route;

// User route
Route::middleware(['auth', 'verified', 'role:' . UserRole::CANDIDATE->value])
    ->prefix('candidate')
    ->name('user.')
    ->group(function () {
        Route::get('/', [CandidateController::class, 'index'])->name('info');
        Route::get('/profile', [CandidateController::class, 'store'])->name('profile');
        
        // Psychometric test routes
        Route::get('/tests/{testId}/start', [CandidateController::class, 'startTest'])->name('tests.start');
        Route::post('/tests/{testId}/submit', [CandidateController::class, 'submitTest'])->name('tests.submit');
    });
