<?php

use App\Enums\UserRole;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VacanciesController;
use Illuminate\Support\Facades\Route;

// Admin route
Route::middleware(['auth', 'verified', 'role:'.UserRole::HR->value])
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
            });
        Route::prefix('questions')
            ->name('questions.')
            ->group(function () {
                Route::get('/', [QuestionController::class, 'store'])->name('info');
                Route::get('/add-questions', [QuestionController::class, 'create'])->name('create');
                Route::put('/{question}', [QuestionController::class, 'update'])->name('update');
                Route::delete('/{question}', [QuestionController::class, 'destroy'])->name('remove');
            });
    });
