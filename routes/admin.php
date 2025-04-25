<?php

use App\Enums\UserRole;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VacanciesController;
use App\Models\Assessment;
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
                Route::get('/', [QuestionController::class, 'store'])->name('info');
                Route::get('/add-questions', [QuestionController::class, 'create'])->name('create');
                Route::get('/edit/{assessment}', [QuestionController::class, 'edit'])->name('edit');
                Route::post('/', [AssessmentController::class, 'store'])->name('store');
                Route::put('/{assessment}', [QuestionController::class, 'update'])->name('update');
                Route::delete('/{question}', [QuestionController::class, 'destroy'])->name('remove');

                // Route::post('/debug-update/{assessment}', function(Request $request, Assessment $assessment) {
                //     Log::info('Debug update received for assessment: ' . $assessment->id, [
                //         'request' => $request->all()
                //     ]);
                //     return response()->json([
                //         'status' => 'received',
                //         'assessment_id' => $assessment->id,
                //         'data' => $request->all()
                //     ]);
                // })->name('debug.update');
            });
    });
