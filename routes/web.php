<?php

use App\Http\Controllers\CandidateController;
use App\Http\Controllers\QuestionController;
use App\Enums\UserRole;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VacanciesController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', [VacanciesController::class, 'index'])->name('home');

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
        Route::get('/questions', [QuestionController::class, 'index'])->name('questions');
    });

// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
    ? redirect()->route('admin.dashboard')
    : redirect()->route('user.info');
})->name('dashboard');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/candidate.php';
