<?php

use App\Enums\UserRole;
use App\Http\Controllers\AssessmentController;
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
        // Tambahkan route untuk halaman dashboard administration
        Route::get('/administration', function () {
            return inertia('admin/company/administration');
        })->name('administration');
        // Tambahkan route untuk halaman assessment
        Route::get('/assessment', function () {
            return inertia('admin/company/assessment');
        })->name('assessment');

        Route::get('/interview', function () {
            return inertia('admin/company/interview');
        })->name('interview');

        Route::get('/reports', function () {
            return inertia('admin/company/reports');
        })->name('reports');

        Route::prefix('users')
            ->name('users.')
            ->group(function () {
                Route::get('/', [UserController::class, 'store'])->name('info');
                Route::post('/', [UserController::class, 'create'])->name('create');
                Route::get('/list', [UserController::class, 'getUsers'])->name('users.list');
                Route::put('/{user}', [UserController::class, 'update'])->name('update');
                Route::delete('/{user}', [UserController::class, 'destroy'])->name('remove');
            });
        Route::prefix('jobs')
            ->name('jobs.')
            ->group(function () {
                Route::get('/', [VacanciesController::class, 'store'])->name('info');
                Route::post('/', [VacanciesController::class, 'create'])->name('create');
                Route::put('/{job}', [VacanciesController::class, 'update'])->name('update');
                Route::delete('/{job}', [VacanciesController::class, 'destroy'])->name('delete');
            });
        Route::prefix('candidates')
            ->name('candidates.')
            ->group(function () {
                Route::get('/', [UserController::class, 'store'])->name('info');
                Route::post('/', [UserController::class, 'create'])->name('create');
                Route::put('/{candidate}', [UserController::class, 'update'])->name('update');
                Route::delete('/{candidate}', [UserController::class, 'destroy'])->name('remove');
                Route::prefix('questions')
                    ->name('questions.')
                    ->group(function () {
                        Route::get('/', [QuestionController::class, 'store'])->name('info');
                    });
            });

        Route::prefix('questions')
            ->name('questions.')
            ->group(function () {
                // Question Set routes
                Route::get('/', [QuestionController::class, 'index'])->name('question-set');
                Route::get('/questions-set', [QuestionController::class, 'index'])->name('question-set');
                Route::get('/questions-set/add-questions', [QuestionController::class, 'create'])->name('create');
                Route::get('/questions-set/view/{question}', [QuestionController::class, 'show'])->name('show');
                Route::get('/questions-set/edit-questions/{question}', [QuestionController::class, 'edit'])->name('edit');
                Route::post('/questions-set', [QuestionController::class, 'store'])->name('store');
                Route::put('/{question}', [QuestionController::class, 'update'])->name('update');
                Route::delete('/{question}', [QuestionController::class, 'destroy'])->name('delete');
            });

        // Add QuestionPacks routes
        Route::prefix('questionpacks')
            ->name('questionpacks.')
            ->group(function () {
                Route::get('/', [QuestionPackController::class, 'index'])->name('index');
                Route::get('/create', [QuestionPackController::class, 'create'])->name('create');
                Route::post('/', [QuestionPackController::class, 'store'])->name('store');
                Route::get('/{questionpack}', [QuestionPackController::class, 'show'])->name('show');
                Route::get('/{questionpack}/edit', [QuestionPackController::class, 'edit'])->name('edit');
                Route::put('/{questionpack}', [QuestionPackController::class, 'update'])->name('update');
                Route::delete('/{questionpack}', [QuestionPackController::class, 'destroy'])->name('destroy');
            });
            
        // Period routes
        Route::resource('periods', PeriodController::class);
        
        // Period company routes
        Route::prefix('periods')->name('periods.')->group(function () {
            Route::get('/company', [PeriodController::class, 'company'])->name('company');
            Route::get('/company/administration', [PeriodController::class, 'administration'])->name('company.administration');
        });
            
        // Company administration filtered by period
        Route::get('/company/{companyId}/administration', [PeriodController::class, 'administration'])
            ->name('company.administration');
            
    });
