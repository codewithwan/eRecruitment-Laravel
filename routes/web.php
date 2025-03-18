<?php

use App\Enums\UserRole;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

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
                Route::delete('/{user}', [UserController::class, 'destroy'])->name('remove');
            });
        Route::get('/questions', [QuestionController::class, 'index'])->name('questions');
    });

// User route
Route::middleware(['auth', 'verified', 'role:' . UserRole::CANDIDATE->value])
    ->prefix('candidate')
    ->name('user.')
    ->group(function () {
        Route::get('/', [CandidateController::class, 'index'])->name('info');
    });

// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
    ? redirect()->route('admin.dashboard')
    : redirect()->route('user.info');
})->name('dashboard');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
