<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use App\Http\Controllers\CandidateController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\ApplicationHistoryController;

Route::get('/', [VacanciesController::class, 'index'])->name('home');
Route::get('/job-hiring', [VacanciesController::class, 'getVacancies'])->name('job-hiring');
Route::get('/job-hiring-landing-page', [VacanciesController::class, 'getVacanciesLandingPage'])->name('job-hiring-landing-page');
Route::get('/application-history', [ApplicationHistoryController::class, 'index'])->name('application-history');
Route::post('/reset-password', [ResetPasswordController::class, 'update'])->name('password.update');

Route::get('/data-pribadi', function () {
        return Inertia::render('DataPribadiForm');
    })->name('data.pribadi');

Route::get('/contact', function () {
        return Inertia::render('landing-page/contact');
    })->name('job-hiring');

Route::get('/about-us', function () {
    return Inertia::render('landing-page/about-us');
})->name('about-us');


// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
    ? redirect()->route('admin.dashboard')
    : redirect()->route('user.profile');
})->name('dashboard');

Route::post('/candidate/profile/data-pribadi', [CandidateController::class, 'storeDataPribadi'])
    ->name('candidate.profile.store');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/candidate.php';
require __DIR__.'/admin.php';
