<?php

use App\Enums\UserRole;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\JobsController;
use Illuminate\Support\Facades\Route;

// User route
Route::middleware(['auth', 'verified', 'role:'.UserRole::CANDIDATE->value])
    ->prefix('candidate')
    ->name('user.')
    ->group(function () {
        Route::get('/', [CandidateController::class, 'index'])->name('info');
        Route::get('/profile', [CandidateController::class, 'profile'])->name('profile');
        Route::post('/profile/data-pribadi', [CandidateController::class, 'storeDataPribadi'])->name('profile.data-pribadi.store');
        Route::prefix('jobs')
            ->name('jobs.')
            ->group(function () {
                Route::get('/', [JobsController::class, 'index'])->name('index');
                Route::post('/{id}/apply', [JobsController::class, 'apply'])->name('apply');
            });
    });
