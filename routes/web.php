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
use App\Models\AboutUs;
use App\Http\Controllers\ContactsController;
use App\Http\Controllers\PersonalDataController;

Route::get('/', [VacanciesController::class, 'index'])->name('home');
// Updated to use the same controller method as candidate/jobs
Route::get('/job-hiring', [JobsController::class, 'index'])->name('job-hiring');
Route::get('/job-hiring-landing-page', [VacanciesController::class, 'getVacanciesLandingPage'])->name('job-hiring-landing-page');
Route::get('/job-detail/{id}', [VacanciesController::class, 'show'])->name('job.detail');
Route::post('/reset-password', [ResetPasswordController::class, 'update'])->name('password.update');

Route::get('/data-pribadi', function () {
        return Inertia::render('DataPribadiForm');
    })->name('data.pribadi');

Route::get('/contact', [ContactsController::class, 'index'])->name('contact');
Route::post('/contact', [ContactsController::class, 'store'])->name('contact.store');

Route::get('/about-us', function () {
    $aboutUs = \App\Models\AboutUs::with('companies')->get();
    return Inertia::render('landing-page/about-us', [
        'aboutUs' => $aboutUs,
    ]);
})->name('about-us');

// API routes untuk AJAX requests
Route::middleware(['auth'])->group(function () {
    // Route untuk get majors
    Route::get('/api/majors', function () {
        try {
            $majors = \App\Models\MasterMajor::orderBy('name', 'asc')->get();
            return response()->json($majors);
        } catch (\Exception $e) {
            \Log::error('Error fetching majors: ' . $e->getMessage());
            return response()->json([
                'error' => 'Gagal mengambil data program studi'
            ], 500);
        }
    });

    // Route untuk education - INI YANG DIGUNAKAN
    Route::get('/api/candidate/education', [CandidateController::class, 'getEducation']);
    Route::post('/api/candidate/education', [CandidateController::class, 'storeEducation']);
});

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

    // HAPUS ROUTE EDUCATION YANG DUPLIKAT INI
    // Route::get('/candidate/education/data', [CandidateController::class, 'getEducation'])
    //     ->name('candidate.education.data');
    // Route::post('/candidate/education/update', [CandidateController::class, 'storeEducation'])
    //     ->name('candidate.education.update');

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
    Route::get('/candidate/work-experiences', [CandidateController::class, 'indexWorkExperiences'])
        ->name('candidate.work-experiences');

    // Rute untuk Edit Pengalaman Kerja
    Route::get('/candidate/work-experience/{id}/edit', [CandidateController::class, 'editWorkExperience'])
        ->name('candidate.work-experience.edit');

    // Achievement routes
    Route::get('/candidate/achievements', [CandidateController::class, 'indexAchievements'])
        ->name('candidate.achievements');
    Route::post('/candidate/achievement', [CandidateController::class, 'storeAchievement'])
        ->name('candidate.achievement.store');
    Route::put('/candidate/achievement/{id}', [CandidateController::class, 'updateAchievement'])
        ->name('candidate.achievement.update');
    Route::delete('/candidate/achievement/{id}', [CandidateController::class, 'deleteAchievement'])
        ->name('candidate.achievement.delete');
});

// Profile routes
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [CandidateController::class, 'profile'])->name('user.profile');
});

// HAPUS ROUTE EDUCATION YANG DUPLIKAT INI JUGA
// Route::middleware(['auth'])->group(function () {
//     Route::get('/candidate/education', [CandidateController::class, 'showEducationForm'])
//         ->name('candidate.education');
//     Route::post('/candidate/education', [CandidateController::class, 'storeEducation'])
//         ->name('candidate.education.store');
//     Route::get('/candidate/education/data', [CandidateController::class, 'getEducation']);
// });

// Organization routes
Route::middleware(['auth'])->group(function () {
    Route::get('/candidate/organizations', [CandidateController::class, 'indexOrganizations'])
        ->name('candidate.organizations');
    Route::post('/candidate/organization', [CandidateController::class, 'storeOrganization'])
        ->name('candidate.organization.store');
    Route::put('/candidate/organization/{id}', [CandidateController::class, 'updateOrganization'])
        ->name('candidate.organization.update');
});

// Social Media routes
Route::middleware(['auth'])->group(function () {
    Route::get('/candidate/social-media', [CandidateController::class, 'indexSocialMedia']);
    Route::post('/candidate/social-media', [CandidateController::class, 'storeSocialMedia']);
    Route::put('/candidate/social-media/{id}', [CandidateController::class, 'updateSocialMedia']);
});

// Skills routes
Route::middleware(['auth'])->group(function () {
    Route::get('/candidate/skills', [CandidateController::class, 'indexSkills'])
        ->name('candidate.skills.index');
    Route::post('/candidate/skills', [CandidateController::class, 'storeSkill'])
        ->name('candidate.skills.store');
    Route::get('/candidate/skills/{id}', [CandidateController::class, 'showSkill'])
        ->name('candidate.skills.show');
    Route::put('/candidate/skills/{id}', [CandidateController::class, 'updateSkill'])
        ->name('candidate.skills.update');
    Route::delete('/candidate/skills/{id}', [CandidateController::class, 'deleteSkill'])
        ->name('candidate.skills.delete');
});

// Languages routes
Route::middleware(['auth'])->group(function () {
    Route::get('/candidate/languages', [CandidateController::class, 'indexLanguages'])
        ->name('candidate.languages.index');
    Route::post('/candidate/languages', [CandidateController::class, 'storeLanguage'])
        ->name('candidate.languages.store');
    Route::put('/candidate/languages/{id}', [CandidateController::class, 'updateLanguage'])
        ->name('candidate.languages.update');
    Route::delete('/candidate/languages/{id}', [CandidateController::class, 'deleteLanguage'])
        ->name('candidate.languages.delete');
});

// Courses routes
Route::middleware(['auth'])->group(function () {
    Route::get('/candidate/courses', [CandidateController::class, 'indexCourses'])
        ->name('candidate.courses.index');
    Route::post('/candidate/courses', [CandidateController::class, 'storeCourse'])
        ->name('candidate.courses.store');
});

// Certifications routes
Route::middleware(['auth'])->group(function () {
    Route::get('/candidate/certifications', [CandidateController::class, 'indexCertifications'])
        ->name('candidate.certifications.index');
    Route::post('/candidate/certifications', [CandidateController::class, 'storeCertification'])
        ->name('candidate.certifications.store');
});

// English Certifications routes
Route::middleware(['auth'])->group(function () {
    Route::get('/candidate/english-certifications', [CandidateController::class, 'indexEnglishCertifications'])
        ->name('candidate.english-certifications.index');
    Route::post('/candidate/english-certifications', [CandidateController::class, 'storeEnglishCertification'])
        ->name('candidate.english-certifications.store');
});

// CV Generation routes
Route::middleware(['auth'])->group(function () {
    Route::get('/candidate/data-completeness', [CandidateController::class, 'checkDataCompleteness'])
        ->name('candidate.data-completeness');
    Route::get('/candidate/cv/generate', [CandidateController::class, 'generateCV'])
        ->name('candidate.cv.generate');
    Route::get('/candidate/cv/download/{id?}', [CandidateController::class, 'downloadCV'])
        ->name('candidate.cv.download');
    Route::get('/candidate/cvs', [CandidateController::class, 'listUserCVs'])
        ->name('candidate.cvs.list');
    Route::delete('/candidate/cv/{id}', [CandidateController::class, 'deleteCV'])
        ->name('candidate.cv.delete');
    Route::get('/candidate/cv/test', [CandidateController::class, 'testPDF'])
        ->name('candidate.cv.test');
});

// Job Recommendations route
Route::get('/candidate/job-recommendations', [CandidateController::class, 'jobRecommendations'])->middleware('auth');

// Tambahkan route untuk apply lowongan
Route::middleware(['auth', 'role:candidate'])->group(function () {
    // Routes untuk personal data dan application history
    Route::get('/personal-data', [PersonalDataController::class, 'index'])->name('candidate.personal-data');
    Route::post('/personal-data/update', [PersonalDataController::class, 'update'])->name('candidate.personal-data.update');
});

// Routes untuk kandidat
Route::middleware(['auth', 'role:candidate'])->prefix('candidate')->group(function () {
    // Detail job dan apply
    Route::get('/job/{id}', [JobsController::class, 'detail'])->name('candidate.job.detail');
    Route::post('/apply/{id}', [JobsController::class, 'apply'])->name('candidate.apply');

    // Removed application history route - now handled in candidate.php
});

// No redirect needed as the route is defined above and in candidate.php

// Redirect /lowongan ke /job-hiring-landing-page untuk konsistensi
Route::get('/lowongan', function() {
    return redirect('/job-hiring-landing-page');
});

// HAPUS ROUTE EDUCATION YANG DUPLIKAT INI JUGA
// Route::middleware(['auth', 'role:candidate'])->prefix('candidate')->group(function () {
//     // Route untuk form data pribadi (GET)
//     Route::get('/data-pribadi', [CandidateController::class, 'profile'])
//         ->name('candidate.data-pribadi');
//
//     Route::get('/education', [CandidateController::class, 'getEducation']);
//     Route::post('/education', [CandidateController::class, 'storeEducation']);
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/candidate.php';
require __DIR__.'/admin.php';

