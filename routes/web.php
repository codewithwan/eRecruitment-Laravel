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
        ->name('candidate.skills');
    Route::post('/candidate/skill', [CandidateController::class, 'storeSkill'])
        ->name('candidate.skill.store');
    Route::put('/candidate/skill/{id}', [CandidateController::class, 'updateSkill'])
        ->name('candidate.skill.update');
    Route::post('/candidate/skill/{id}', [CandidateController::class, 'updateSkill'])
        ->name('candidate.skill.update.post'); // untuk FormData dengan _method
    Route::delete('/candidate/skill/{id}', [CandidateController::class, 'deleteSkill'])
        ->name('candidate.skill.delete');

    // Course routes
    Route::get('/candidate/courses', [CandidateController::class, 'indexCourses'])
        ->name('candidate.courses');
    Route::post('/candidate/course', [CandidateController::class, 'storeCourse'])
        ->name('candidate.course.store');
    Route::put('/candidate/course/{id}', [CandidateController::class, 'updateCourse'])
        ->name('candidate.course.update');
    Route::post('/candidate/course/{id}', [CandidateController::class, 'updateCourse'])
        ->name('candidate.course.update.post');
    Route::delete('/candidate/course/{id}', [CandidateController::class, 'deleteCourse'])
        ->name('candidate.course.delete');

    // Certification routes
    Route::get('/candidate/certifications', [CandidateController::class, 'indexCertifications'])
        ->name('candidate.certifications');
    Route::post('/candidate/certification', [CandidateController::class, 'storeCertification'])
        ->name('candidate.certification.store');
    Route::put('/candidate/certification/{id}', [CandidateController::class, 'updateCertification'])
        ->name('candidate.certification.update');
    Route::post('/candidate/certification/{id}', [CandidateController::class, 'updateCertification'])
        ->name('candidate.certification.update.post');
    Route::delete('/candidate/certification/{id}', [CandidateController::class, 'deleteCertification'])
        ->name('candidate.certification.delete');

    Route::get('/candidate/languages', [CandidateController::class, 'indexLanguages'])
        ->name('candidate.languages');
    Route::post('/candidate/language', [CandidateController::class, 'storeLanguage'])
        ->name('candidate.language.store');
    Route::put('/candidate/language/{id}', [CandidateController::class, 'updateLanguage'])
        ->name('candidate.language.update');
    Route::post('/candidate/language/{id}', [CandidateController::class, 'updateLanguage'])
        ->name('candidate.language.update.post');
    Route::delete('/candidate/language/{id}', [CandidateController::class, 'deleteLanguage'])
        ->name('candidate.language.delete');

   
    Route::get('/candidate/english-certifications', [CandidateController::class, 'indexEnglishCertifications'])
        ->name('candidate.english-certifications');
    Route::post('/candidate/english-certification', [CandidateController::class, 'storeEnglishCertification'])
        ->name('candidate.english-certification.store');
    Route::put('/candidate/english-certification/{id}', [CandidateController::class, 'updateEnglishCertification'])
        ->name('candidate.english-certification.update');
    Route::post('/candidate/english-certification/{id}', [CandidateController::class, 'updateEnglishCertification'])
        ->name('candidate.english-certification.update.post');
    Route::delete('/candidate/english-certification/{id}', [CandidateController::class, 'deleteEnglishCertification'])
        ->name('candidate.english-certification.delete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/candidate.php';
require __DIR__.'/admin.php';
