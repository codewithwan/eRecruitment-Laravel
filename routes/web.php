<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Admin route
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Make sure dashboard route is defined before users route
    Route::get('/dashboard', [UserController::class, 'index'])->name('admin.dashboard');
    Route::get('/users', [UserController::class, 'userManagement'])->name('admin.users');
});

// User route
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/psychotest', function () {
        return Inertia::render('psychotest');
    })->name('user.psychotest');
});

// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === 'admin'
    ? redirect()->route('admin.dashboard')
    : redirect()->route('user.psychotest');
})->name('dashboard');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
