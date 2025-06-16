<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\JobsController;
use App\Http\Controllers\ApplicationHistoryController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\ContactsController;
use App\Http\Controllers\PersonalDataController;

// Public Routes
Route::get('/', [VacanciesController::class, 'index'])->name('home');
Route::get('/job-hiring', [JobsController::class, 'index'])->name('job-hiring');
Route::get('/job-hiring-landing-page', [VacanciesController::class, 'getVacanciesLandingPage'])->name('job-hiring-landing-page');
Route::get('/job-detail/{id}', [VacanciesController::class, 'show'])->name('job.detail');

Route::get('/application-history', function () {
    return Inertia::render('candidate/jobs/application-history');
})->name('application-history');

Route::post('/reset-password', [ResetPasswordController::class, 'update'])->name('password.update');

Route::get('/data-pribadi', fn () => Inertia::render('DataPribadiForm'))->name('data.pribadi');

Route::get('/contact', [ContactsController::class, 'index'])->name('contact');
Route::post('/contact', [ContactsController::class, 'store'])->name('contact.store');

Route::get('/about-us', function () {
    $aboutUs = \App\Models\AboutUs::with('companies')->get();
    return Inertia::render('landing-page/about-us', [
        'aboutUs' => $aboutUs,
    ]);
})->name('about-us');

// Authenticated API Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/api/majors', function () {
        try {
            return response()->json(\App\Models\MasterMajor::orderBy('name', 'asc')->get());
        } catch (\Exception $e) {
            \Log::error('Error fetching majors: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal mengambil data program studi'], 500);
        }
    });

    Route::get('/api/candidate/education', [CandidateController::class, 'getEducation']);
    Route::post('/api/candidate/education', [CandidateController::class, 'storeEducation']);
    Route::get('/api/candidate/profile-image', [CandidateController::class, 'getProfileImage'])->name('candidate.profile-image.get');
    Route::post('/api/candidate/profile-image', [CandidateController::class, 'uploadProfileImage'])->name('candidate.profile-image.upload');
    Route::get('/api/candidate/educations', [CandidateController::class, 'getAllEducations']);
    Route::put('/api/candidate/education/{id}', [CandidateController::class, 'updateEducation']);
    Route::delete('/api/candidate/education/{id}', [CandidateController::class, 'deleteEducation']);
});

// Role-based Dashboard Redirect
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
        ? redirect()->route('admin.dashboard')
        : redirect()->route('user.profile');
})->name('dashboard');

// Candidate Data Pribadi
Route::post('/candidate/data-pribadi', [CandidateController::class, 'storeDataPribadi'])->name('candidate.data-pribadi.store');
Route::middleware(['auth'])->group(function () {
    Route::get('/candidate/data-pribadi', [CandidateController::class, 'profile'])->name('candidate.data-pribadi');

    // Work Experience Routes
    Route::resource('/candidate/work-experience', CandidateController::class)->only(['index', 'store', 'update', 'show', 'destroy']);
    Route::get('/candidate/work-experience/{id}/edit', [CandidateController::class, 'editWorkExperience'])->name('candidate.work-experience.edit');
    Route::get('/candidate/work-experiences', [CandidateController::class, 'indexWorkExperiences'])->name('candidate.work-experiences');

    // Achievements Routes
    Route::get('/candidate/achievements', [CandidateController::class, 'indexAchievements'])->name('candidate.achievements');
    Route::post('/candidate/achievement', [CandidateController::class, 'storeAchievement'])->name('candidate.achievement.store');
    Route::put('/candidate/achievement/{id}', [CandidateController::class, 'updateAchievement'])->name('candidate.achievement.update');
    Route::delete('/candidate/achievement/{id}', [CandidateController::class, 'deleteAchievement'])->name('candidate.achievement.delete');

    // Profile
    Route::get('/profile', [CandidateController::class, 'profile'])->name('user.profile');

    // Organization
    Route::resource('/candidate/organizations', CandidateController::class)->except(['create', 'edit', 'show']);

    // Social Media
    Route::get('/candidate/social-media', [CandidateController::class, 'indexSocialMedia']);
    Route::post('/candidate/social-media', [CandidateController::class, 'storeSocialMedia']);
    Route::put('/candidate/social-media/{id}', [CandidateController::class, 'updateSocialMedia']);
    Route::delete('/candidate/social-media/{id}', [CandidateController::class, 'deleteSocialMedia']);

    // Skills
    Route::resource('/candidate/skills', CandidateController::class);

    // Languages
    Route::resource('/candidate/languages', CandidateController::class);

    // Courses
    Route::get('/candidate/courses', [CandidateController::class, 'indexCourses'])->name('candidate.courses.index');
    Route::post('/candidate/courses', [CandidateController::class, 'storeCourse'])->name('candidate.courses.store');
    Route::delete('/candidate/courses/{id}', [CandidateController::class, 'deleteCourse'])->name('candidate.courses.delete');

    // Certifications
    Route::get('/candidate/certifications', [CandidateController::class, 'indexCertifications'])->name('candidate.certifications.index');
    Route::post('/candidate/certifications', [CandidateController::class, 'storeCertification'])->name('candidate.certifications.store');
    Route::delete('/candidate/certifications/{id}', [CandidateController::class, 'deleteCertification'])->name('candidate.certifications.delete');

    // English Certifications
    Route::get('/candidate/english-certifications', [CandidateController::class, 'indexEnglishCertifications'])->name('candidate.english-certifications.index');
    Route::post('/candidate/english-certifications', [CandidateController::class, 'storeEnglishCertification'])->name('candidate.english-certifications.store');
    Route::delete('/candidate/english-certifications/{id}', [CandidateController::class, 'deleteEnglishCertification'])->name('candidate.english-certifications.delete');

    // CV Generation
    Route::get('/candidate/data-completeness', [CandidateController::class, 'checkDataCompleteness'])->name('candidate.data-completeness');
    Route::get('/candidate/cv/generate', [CandidateController::class, 'generateCV'])->name('candidate.cv.generate');
    Route::get('/candidate/cv/download/{id?}', [CandidateController::class, 'downloadCV'])->name('candidate.cv.download');
    Route::get('/candidate/cvs', [CandidateController::class, 'listUserCVs'])->name('candidate.cvs.list');
    Route::delete('/candidate/cv/{id}', [CandidateController::class, 'deleteCV'])->name('candidate.cv.delete');
    Route::get('/candidate/cv/test', [CandidateController::class, 'testPDF'])->name('candidate.cv.test');

    // Job Recommendations
    Route::get('/candidate/job-recommendations', [CandidateController::class, 'jobRecommendations']);
});

// Candidate-Specific Routes (requires role)
Route::middleware(['auth', 'role:candidate'])->group(function () {
    Route::get('/personal-data', [PersonalDataController::class, 'index'])->name('candidate.personal-data');
    Route::post('/personal-data/update', [PersonalDataController::class, 'update'])->name('candidate.personal-data.update');
    Route::prefix('candidate')->group(function () {
        Route::get('/job/{id}', [JobsController::class, 'detail'])->name('candidate.job.detail');
        Route::post('/apply/{id}', [JobsController::class, 'apply'])->name('candidate.apply');
    });
});

// Redirects
Route::get('/lowongan', fn () => redirect('/job-hiring-landing-page'));

// Additional Route Files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/candidate.php';
require __DIR__.'/admin.php';
