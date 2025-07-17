<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
        ? redirect()->route('admin.dashboard')
        : redirect()->route('user.info');
})->name('dashboard');

// Company Management Routes (hanya index dan destroy)
Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::get('company-management', [App\Http\Controllers\Admin\CompanyManagementController::class, 'index'])
        ->name('company-management.index');
    Route::delete('company-management/{company}', [App\Http\Controllers\Admin\CompanyManagementController::class, 'destroy'])
        ->name('company-management.destroy');
});

Route::middleware(['auth'])->group(function () {
    // Period management routes
    Route::prefix('dashboard')->name('periods.')->group(function () {
        Route::get('/periods', [PeriodController::class, 'index'])->name('index');
        Route::post('/periods', [PeriodController::class, 'store'])->name('store');
        Route::get('/periods/{period}/edit', [PeriodController::class, 'edit'])->name('edit');
        Route::put('/periods/{period}', [PeriodController::class, 'update'])->name('update');
        Route::delete('/periods/{period}', [PeriodController::class, 'destroy'])->name('destroy');
        
        // Add vacancies list route
        Route::get('/vacancies/list', [VacanciesController::class, 'getVacanciesList'])->name('vacancies.list');
    });

    // Company management routes
    Route::prefix('dashboard')->name('companies.')->group(function () {
        Route::prefix('companies')->group(function () {
            Route::get('/', [CompanyController::class, 'index'])->name('index');
            Route::get('/create', [CompanyController::class, 'create'])->name('create');
            Route::post('/', [CompanyController::class, 'store'])->name('store');
            Route::get('/{company}', [CompanyController::class, 'show'])->name('show');
            Route::get('/{company}/edit', [CompanyController::class, 'edit'])->name('edit');
            Route::put('/{company}', [CompanyController::class, 'update'])->name('update');
            Route::delete('/{company}', [CompanyController::class, 'destroy'])->name('destroy');
            Route::get('/{company}/periods', [CompanyController::class, 'periods'])->name('periods');
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/candidate.php';
require __DIR__ . '/admin.php';
