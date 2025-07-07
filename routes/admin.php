<?php

use App\Enums\UserRole;
use App\Http\Controllers\ApplicationStageController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuestionPackController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VacanciesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

// Admin route
Route::middleware(['auth', 'verified', 'role:' . UserRole::HR->value])
    ->prefix('dashboard')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('dashboard');

        // Redirect old routes to new ones
        Route::get('/company/administration', function (Request $request) {
            return redirect()->route('admin.recruitment.administration.index', [
                'company' => $request->query('company'),
                'period' => $request->query('period')
            ]);
        });

        // Application Stage Management
        Route::prefix('recruitment')->name('recruitment.')->group(function () {
            // Administration Stage
            Route::prefix('administration')->name('administration.')->group(function () {
                Route::get('/', [ApplicationStageController::class, 'administration'])->name('index');
                Route::get('/{id}', [ApplicationStageController::class, 'administrationDetail'])->name('detail');
                Route::post('/{id}/approve', [ApplicationStageController::class, 'approve'])->name('approve');
                Route::post('/{id}/reject', [ApplicationStageController::class, 'reject'])->name('reject');
            });

            // Assessment Stage
            Route::prefix('assessment')->name('assessment.')->group(function () {
                Route::get('/', [ApplicationStageController::class, 'assessment'])->name('index');
                Route::get('/{id}', [ApplicationStageController::class, 'assessmentDetail'])->name('detail');
                Route::post('/{id}/approve', [ApplicationStageController::class, 'approve'])->name('approve');
                Route::post('/{id}/reject', [ApplicationStageController::class, 'reject'])->name('reject');
            });

            // Interview Stage
            Route::prefix('interview')->name('interview.')->group(function () {
                Route::get('/', [ApplicationStageController::class, 'interview'])->name('index');
                Route::get('/{id}', [ApplicationStageController::class, 'interviewDetail'])->name('detail');
                Route::post('/{id}/approve', [ApplicationStageController::class, 'approve'])->name('approve');
                Route::post('/{id}/reject', [ApplicationStageController::class, 'reject'])->name('reject');
            });
        });

        // User Management
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'store'])->name('info');
            Route::post('/', [UserController::class, 'create'])->name('create');
            Route::get('/list', [UserController::class, 'getUsers'])->name('users.list');
            Route::put('/{user}', [UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('remove');
        });

        // Job Management
        Route::prefix('jobs')->name('jobs.')->group(function () {
            Route::get('/', [VacanciesController::class, 'store'])->name('info');
            Route::post('/', [VacanciesController::class, 'create'])->name('create');
            Route::put('/{job}', [VacanciesController::class, 'update'])->name('update');
            Route::delete('/{job}', [VacanciesController::class, 'destroy'])->name('delete');
        });

        // Question Management
        Route::prefix('questions')->name('questions.')->group(function () {
            Route::get('/', [QuestionController::class, 'index'])->name('question-set');
            Route::get('/questions-set', [QuestionController::class, 'index'])->name('question-set');
            Route::get('/questions-set/add-questions', [QuestionController::class, 'create'])->name('create');
            Route::get('/questions-set/view/{question}', [QuestionController::class, 'show'])->name('show');
            Route::get('/questions-set/edit-questions/{question}', [QuestionController::class, 'edit'])->name('edit');
            Route::post('/questions-set', [QuestionController::class, 'store'])->name('store');
            Route::put('/{question}', [QuestionController::class, 'update'])->name('update');
            Route::delete('/{question}', [QuestionController::class, 'destroy'])->name('delete');
        });

        // Question Packs
        Route::prefix('questionpacks')->name('questionpacks.')->group(function () {
            Route::get('/', [QuestionPackController::class, 'index'])->name('index');
            Route::get('/create', [QuestionPackController::class, 'create'])->name('create');
            Route::post('/', [QuestionPackController::class, 'store'])->name('store');
            Route::get('/{questionpack}', [QuestionPackController::class, 'show'])->name('show');
            Route::get('/{questionpack}/edit', [QuestionPackController::class, 'edit'])->name('edit');
            Route::put('/{questionpack}', [QuestionPackController::class, 'update'])->name('update');
            Route::delete('/{questionpack}', [QuestionPackController::class, 'destroy'])->name('destroy');
        });

        // Period Management
        Route::resource('periods', PeriodController::class);

        // Department and Stage Management
        Route::prefix('management')->name('management.')->group(function () {
            Route::get('/department-stage', [DepartmentController::class, 'index'])->name('department-stage');
            
            // Department routes
            Route::post('/departments', [DepartmentController::class, 'storeDepartment'])->name('departments.store');
            Route::put('/departments/{id}', [DepartmentController::class, 'updateDepartment'])->name('departments.update');
            Route::delete('/departments/{id}', [DepartmentController::class, 'destroyDepartment'])->name('departments.destroy');
            
            // Recruitment Stage routes
            Route::post('/stages', [DepartmentController::class, 'storeStage'])->name('stages.store');
            Route::put('/stages/{id}', [DepartmentController::class, 'updateStage'])->name('stages.update');
            Route::delete('/stages/{id}', [DepartmentController::class, 'destroyStage'])->name('stages.destroy');
            Route::put('/stages/order', [DepartmentController::class, 'updateStageOrder'])->name('stages.order');
            
            // Education Level routes
            Route::post('/education-levels', [DepartmentController::class, 'storeEducationLevel'])->name('education-levels.store');
            Route::put('/education-levels/{id}', [DepartmentController::class, 'updateEducationLevel'])->name('education-levels.update');
            Route::delete('/education-levels/{id}', [DepartmentController::class, 'destroyEducationLevel'])->name('education-levels.destroy');
            
            // Major routes
            Route::post('/majors', [DepartmentController::class, 'storeMajor'])->name('majors.store');
            Route::put('/majors/{id}', [DepartmentController::class, 'updateMajor'])->name('majors.update');
            Route::delete('/majors/{id}', [DepartmentController::class, 'destroyMajor'])->name('majors.destroy');
        });
    });
