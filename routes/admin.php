<?php

use App\Enums\UserRole;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VacanciesController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\PsychometricController;
use App\Http\Controllers\PsychometricAssignmentController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Assessment;

// Admin route
Route::middleware(['auth', 'verified', 'role:' . UserRole::HR->value])
    ->prefix('dashboard')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('dashboard');
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
                        Route::get('/', [QuestionController::class, 'store'])->name('info'); // Changed from index to store
                        // Other routes...
                    });
            }); // Added missing closing bracket for candidates group

        Route::prefix('questions')
            ->name('questions.')
            ->group(function () {
                Route::get('/', [QuestionController::class, 'store'])->name('info');
                Route::get('/add-questions', [QuestionController::class, 'create'])->name('create');
                Route::get('/edit/{assessment}', [QuestionController::class, 'edit'])->name('edit');
                Route::post('/', [AssessmentController::class, 'store'])->name('store');
                Route::put('/{assessment}', [QuestionController::class, 'update'])->name('update');
                Route::delete('/{question}', [QuestionController::class, 'destroy'])->name('remove');

                // Add debug route to test update
                Route::post('/debug-update/{assessment}', function(Request $request, Assessment $assessment) {
                    Log::info('Debug update received for assessment: ' . $assessment->id, [
                        'request' => $request->all()
                    ]);
                    return response()->json([
                        'status' => 'received',
                        'assessment_id' => $assessment->id,
                        'data' => $request->all()
                    ]);
                })->name('debug.update');
            });
        
        // Fix the psychometric routes - remove nested duplicate routes
        Route::prefix('psychometric')
            ->name('psychometric.')
            ->group(function () {
                Route::get('/', [PsychometricController::class, 'index'])->name('index');
                Route::post('/', [PsychometricController::class, 'store'])->name('store');
                Route::get('/{test}', [PsychometricController::class, 'show'])->name('show');
                Route::put('/{test}', [PsychometricController::class, 'update'])->name('update');
                Route::delete('/{test}', [PsychometricController::class, 'destroy'])->name('delete');
                Route::get('/data', [PsychometricController::class, 'getTests'])->name('data');
                
                // Properly nest the assignments routes under psychometric
                Route::prefix('assignments')
                    ->name('assignments.')
                    ->group(function () {
                        Route::get('/', [PsychometricAssignmentController::class, 'index'])->name('index'); // Add missing index route
                        Route::get('/create', [PsychometricAssignmentController::class, 'create'])->name('create');
                        Route::post('/', [PsychometricAssignmentController::class, 'store'])->name('store');
                        Route::get('/{assignment}', [PsychometricAssignmentController::class, 'show'])->name('show');
                        Route::get('/{assignment}/edit', [PsychometricAssignmentController::class, 'edit'])->name('edit');
                        Route::put('/{assignment}', [PsychometricAssignmentController::class, 'update'])->name('update');
                        Route::delete('/{assignment}', [PsychometricAssignmentController::class, 'destroy'])->name('delete');
                        Route::post('/{assignment}/send-notification', [PsychometricAssignmentController::class, 'sendNotification'])->name('send-notification');
                        Route::put('/{assignment}/status', [PsychometricAssignmentController::class, 'updateStatus'])->name('update-status');
                    });
            });
    });

// Move these debug routes inside the admin group if they should be protected
Route::get('/debug-logs', function() {
    $logs = array_slice(file(storage_path('logs/laravel-' . date('Y-m-d') . '.log')), -100);
    return response()->json(['logs' => $logs]);
})->name('debug.logs');

Route::post('/debug-form', function(Request $request) {
    Log::info('Debug form submission received:', $request->all());
    return response()->json([
        'status' => 'received',
        'data' => $request->all()
    ]);
})->name('debug.form');