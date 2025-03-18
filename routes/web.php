<?php

use App\Http\Controllers\CandidateController;
use App\Http\Controllers\QuestionController;
use App\Enums\UserRole;
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
        Route::get('/users', [UserController::class, 'userManagement'])->name('users');
        
});


// User route
Route::middleware(['auth', 'verified', 'role:' . UserRole::CANDIDATE->value])
    ->prefix('candidate')
    ->name('user.')
    ->group(function () {
        Route::get('/', [CandidateController::class, 'info'])->name('candidate');
        Route::get('/questions', [QuestionController::class, 'index'])->name('questions');
        Route::post('/questions/answer', [QuestionController::class, 'storeAnswer'])->name('questions.answer');
        // Remove the redundant route
        // Route::get('/info', [CandidateController::class, 'info'])->name('candidate');
});

// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
        ? redirect()->route('admin.dashboard')
        : redirect()->route('user.candidate');
})->name('dashboard');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
