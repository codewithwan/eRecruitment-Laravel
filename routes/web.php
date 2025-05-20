<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use App\Http\Controllers\CandidateController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\ApplicationHistoryController;
use App\Http\Controllers\AboutUsController;

// Home & Landing
Route::get('/', [VacanciesController::class, 'index'])->name('home');
Route::get('/job-hiring', [VacanciesController::class, 'getVacancies'])->name('job-hiring');
Route::get('/job-hiring-landing-page', [VacanciesController::class, 'getVacanciesLandingPage'])->name('job-hiring-landing-page');
Route::get('/application-history', [ApplicationHistoryController::class, 'index'])->name('application-history');
Route::post('/reset-password', [ResetPasswordController::class, 'update'])->name('password.update');
Route::get('/data-pribadi', [CandidateController::class, 'profile'])->name('data.pribadi');
Route::get('/about-us', [AboutUsController::class, 'index'])->name('about-us');
Route::get('/job-detail/{id}', [VacanciesController::class, 'show'])->name('job.detail');

// Hapus route duplikat untuk /job-hiring dan /contact
Route::get('/lowongan-pekerjaan', function () {
    return Inertia::render('landing-page/job-hiring-landing-page');
})->name('lowongan-pekerjaan');
Route::get('/kontak', function () {
    return Inertia::render('landing-page/kontak');
})->name('kontak');

// Redirect based on role
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/redirect', function () {
        return Auth::user()->role === UserRole::HR
            ? redirect()->route('admin.dashboard')
            : redirect()->route('user.profile');
    })->name('redirect');

    Route::post('/candidate/profile/data-pribadi', [CandidateController::class, 'storeDataPribadi'])
        ->name('candidate.profile.store');
});

// Candidate Profile & Work Experience
Route::middleware(['auth'])->group(function () {
    // Hanya gunakan satu route profile kandidat
    Route::get('/candidate/profile', function () {
        return Inertia::render('CandidateProfile');
    })->name('candidate.profile');

    // Work Experience routes
    Route::get('/candidate/work-experience/{id}', [CandidateController::class, 'showWorkExperience'])
        ->name('candidate.work-experience.show');
    Route::post('/candidate/work-experience', [CandidateController::class, 'storeWorkExperience'])
        ->name('candidate.work-experience.store');
    Route::put('/candidate/work-experience/{id}', [CandidateController::class, 'updateWorkExperience'])
        ->name('candidate.work-experience.update');
    Route::delete('/candidate/work-experience/{id}', [CandidateController::class, 'deleteWorkExperience'])
        ->name('candidate.work-experience.delete');
    Route::get('/candidate/work-experiences', [CandidateController::class, 'indexWorkExperiences'])
        ->name('candidate.work-experiences');
    Route::get('/candidate/work-experience/{id}/edit', [CandidateController::class, 'editWorkExperience'])
        ->name('candidate.work-experience.edit');

    // Education routes
    Route::get('/candidate/education', [CandidateController::class, 'showEducationForm'])
        ->name('candidate.education');
    Route::post('/candidate/education', [CandidateController::class, 'storeEducation'])
        ->name('candidate.education.store');
    Route::get('/candidate/education/data', [CandidateController::class, 'getEducation']);

    // Organization routes
    Route::get('/candidate/organizations', [CandidateController::class, 'indexOrganizations'])
        ->name('candidate.organizations');
    Route::post('/candidate/organization', [CandidateController::class, 'storeOrganization'])
        ->name('candidate.organization.store');
    Route::put('/candidate/organization/{id}', [CandidateController::class, 'updateOrganization'])
        ->name('candidate.organization.update');
});

// Register
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');

// Import additional route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/candidate.php';
require __DIR__.'/admin.php';
