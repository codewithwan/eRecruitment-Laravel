<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use App\Http\Controllers\CandidateController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ResetPasswordController;
use App\Models\AboutUs;
use App\Http\Controllers\ContactsController;

Route::get('/', [VacanciesController::class, 'index'])->name('home');
Route::get('/job-hiring', [VacanciesController::class, 'getVacancies'])->name('job-hiring');
Route::get('/job-hiring-landing-page', [VacanciesController::class, 'getVacanciesLandingPage'])->name('job-hiring-landing-page');
Route::get('/job-detail/{id}', [VacanciesController::class, 'show'])->name('job.detail');
Route::get('/application-history', function () {
    return Inertia::render('candidate/jobs/application-history');
})->name('application-history');
Route::post('/reset-password', [ResetPasswordController::class, 'update'])->name('password.update');

Route::get('/data-pribadi', function () {
        return Inertia::render('DataPribadiForm');
    })->name('data.pribadi');

Route::get('/contact', [ContactsController::class, 'index'])->name('contact');
Route::post('/contact', [ContactsController::class, 'store'])->name('contact.store');

Route::get('/about-us', function () {
    $aboutUs = \App\Models\AboutUs::with('company')->get();
    return Inertia::render('landing-page/about-us', [
        'aboutUs' => $aboutUs,
    ]);
})->name('about-us');

// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
    ? redirect()->route('admin.dashboard')
    : redirect()->route('user.profile');
})->name('dashboard');

// Route untuk simpan data pribadi (POST)
Route::post('/candidate/data-pribadi', [CandidateController::class, 'storeDataPribadi'])
    ->name('candidate.data-pribadi.store');

Route::middleware(['auth'])->group(function () {
    // Route untuk form data pribadi (GET)
    Route::get('/candidate/data-pribadi', [CandidateController::class, 'profile'])
        ->name('candidate.data-pribadi');

    Route::get('/candidate/education/data', [CandidateController::class, 'getEducation'])
        ->name('candidate.education.data');

    Route::post('/candidate/education/update', [CandidateController::class, 'storeEducation'])
        ->name('candidate.education.update');

    // Tambah pengalaman kerja (POST)
    Route::post('/candidate/work-experience', [CandidateController::class, 'storeWorkExperience'])
        ->name('candidate.work-experience.store');

    // Update pengalaman kerja (PUT)
    Route::put('/candidate/work-experience/{id}', [CandidateController::class, 'updateWorkExperience'])
        ->name('candidate.work-experience.update');

    // Ambil semua pengalaman kerja (GET)
    Route::get('/candidate/work-experience', [CandidateController::class, 'getWorkExperiences'])
        ->name('candidate.work-experience.index');

    // Ambil satu pengalaman kerja (GET)
    Route::get('/candidate/work-experience/{id}', [CandidateController::class, 'showWorkExperience'])
        ->name('candidate.work-experience.show');

    // Hapus pengalaman kerja (DELETE)
    Route::delete('/candidate/work-experience/{id}', [CandidateController::class, 'deleteWorkExperience'])
        ->name('candidate.work-experience.delete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/candidate.php';
require __DIR__.'/admin.php';
