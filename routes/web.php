<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [VacanciesController::class, 'index'])->name('home');
Route::get('/job-hiring', function () {
    return Inertia::render('candidate/jobs/job-hiring');
})->name('job-hiring');
Route::get('/application-history', function () {
    return Inertia::render('candidate/jobs/application-history');
})->name('application-history');

Route::get('/data-pribadi', function () {
        return Inertia::render('DataPribadiForm');
    })->name('data.pribadi');

Route::get('/lowongan-pekerjaan', function () {
        return Inertia::render('landing-page/job-hiring-landing-page');
    })->name('job-hiring');
Route::get('/kontak', function () {
        return Inertia::render('landing-page/kontak');
    })->name('job-hiring');
// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
    ? redirect()->route('admin.dashboard')
    : redirect()->route('user.info');
})->name('dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/candidate.php';
require __DIR__.'/admin.php';
