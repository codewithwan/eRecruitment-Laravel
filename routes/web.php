<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\CandidatesWorkExperiencesController; // Pastikan controller ini ada
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [VacanciesController::class, 'index'])->name('home');
Route::get('/job-hiring', [VacanciesController::class, 'getVacancies'])->name('job-hiring');
Route::get('/application-history', function () {
    return Inertia::render('candidate/jobs/application-history');
})->name('application-history');

// Seharusnya menggunakan controller untuk mengambil data
Route::get('/data-pribadi', [CandidateController::class, 'profile'])->name('data.pribadi');

// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
    ? redirect()->route('admin.dashboard')
    : redirect()->route('user.profile');
})->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/candidate/profile/data-pribadi', [CandidateController::class, 'storeDataPribadi'])
        ->name('candidate.profile.store');
});

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::post('/candidate/education', [CandidateEducationController::class, 'store'])
//         ->name('candidate.education.store');
// });

Route::middleware(['auth', 'verified'])->group(function () {
    // Rute yang memerlukan autentikasi dan verifikasi email
});

Route::middleware(['auth'])->group(function () {
    // ...existing routes...
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

Route::middleware(['auth'])->group(function () {
    // Profile routes
    Route::get('/profile', [CandidateController::class, 'profile'])->name('user.profile');
    
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

Route::middleware(['auth'])->group(function () {
    // ...existing routes...
    Route::get('/candidate/achievements', [CandidateController::class, 'indexAchievements']);
    // ...existing routes...
    Route::post('/candidate/organization', [CandidateController::class, 'storeOrganization']);
    Route::put('/candidate/organization/{id}', [CandidateController::class, 'updateOrganization']);
    // ...existing routes...
    Route::post('/candidate/achievement', [CandidateController::class, 'storeAchievement']);
    Route::put('/candidate/achievement/{id}', [CandidateController::class, 'updateAchievement']);
});

Route::middleware(['auth'])->group(function () {
    // ...existing routes...
    Route::put('/candidate/achievement/{id}', [CandidateController::class, 'updateAchievement'])
        ->name('candidate.achievement.update');
    Route::get('/candidate/achievement/{id}', [CandidateController::class, 'showAchievement']);
});

Route::middleware(['auth'])->group(function () {
    // ...existing routes...
    Route::get('/candidate/achievement/{id}', [CandidateController::class, 'showAchievement'])
        ->name('candidate.achievement.show');
});

Route::middleware(['auth'])->group(function () {
    // ...existing routes...
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

    // Languages routes
    Route::get('/candidate/languages', [CandidateController::class, 'indexLanguages'])
        ->name('candidate.languages.index');
    Route::post('/candidate/languages', [CandidateController::class, 'storeLanguage'])
        ->name('candidate.languages.store');
    Route::put('/candidate/languages/{id}', [CandidateController::class, 'updateLanguage'])
        ->name('candidate.languages.update');
    Route::delete('/candidate/languages/{id}', [CandidateController::class, 'deleteLanguage'])
        ->name('candidate.languages.delete');

    // Courses routes
    Route::get('/candidate/courses', [CandidateController::class, 'indexCourses'])
        ->name('candidate.courses.index');
    Route::post('/candidate/courses', [CandidateController::class, 'storeCourse'])
        ->name('candidate.courses.store');

    // Certifications routes
    Route::get('/candidate/certifications', [CandidateController::class, 'indexCertifications'])
        ->name('candidate.certifications.index');
    Route::post('/candidate/certifications', [CandidateController::class, 'storeCertification'])
        ->name('candidate.certifications.store');

    // English Certifications routes
    Route::get('/candidate/english-certifications', [CandidateController::class, 'indexEnglishCertifications'])
        ->name('candidate.english-certifications.index');
    Route::post('/candidate/english-certifications', [CandidateController::class, 'storeEnglishCertification'])
        ->name('candidate.english-certifications.store');

    // CV Generation routes
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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/candidate.php';
require __DIR__.'/admin.php';

