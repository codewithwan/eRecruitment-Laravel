<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use App\Http\Controllers\PeriodController; // Add this import
use App\Http\Controllers\CompanyController; // Add this import
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', [VacanciesController::class, 'index'])->name('home');

// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
        ? redirect()->route('admin.dashboard')
        : redirect()->route('user.info');
})->name('dashboard');

// Add this route temporarily for debugging
Route::get('/debug/questions', function () {
    $questions = App\Models\Question::all();
    echo "Total questions in database: " . $questions->count() . "<br>";
    if ($questions->count() > 0) {
        echo "<pre>";
        print_r($questions->first()->toArray());
        echo "</pre>";
    }
    return "Done";
});

// Periods routes
Route::middleware(['auth'])->group(function () {
    // Period routes
    Route::get('/dashboard/periods', [PeriodController::class, 'index'])->name('periods.index');
    Route::get('/dashboard/periods/create', [PeriodController::class, 'create'])->name('periods.create');
    Route::post('/dashboard/periods', [PeriodController::class, 'store'])->name('periods.store');
    Route::get('/dashboard/periods/{period}', [PeriodController::class, 'show'])->name('periods.show');
    Route::get('/dashboard/periods/{period}/edit', [PeriodController::class, 'edit'])->name('periods.edit');
    Route::put('/dashboard/periods/{period}', [PeriodController::class, 'update'])->name('periods.update');
    Route::delete('/dashboard/periods/{period}', [PeriodController::class, 'destroy'])->name('periods.destroy');
    
    // Period company routes
    Route::get('/dashboard/periods/company', [PeriodController::class, 'company'])->name('periods.company');
    Route::get('/dashboard/periods/company/administration', [PeriodController::class, 'administration'])->name('periods.company.administration');
    Route::get('/dashboard/periods/company/assessment', [PeriodController::class, 'assessment'])->name('periods.company.assessment');
    Route::get('/dashboard/periods/company/interview', [PeriodController::class, 'interview'])->name('periods.company.interview');
    Route::get('/dashboard/periods/company/reports', [PeriodController::class, 'reports'])->name('periods.company.reports');
    
    // Company administration filtered by period
    Route::get('/dashboard/company/{companyId}/administration', [PeriodController::class, 'administration'])
        ->name('company.administration');
    
    // Company administration route
    Route::get('/dashboard/company/administration', [CompanyController::class, 'administration'])
        ->name('company.administration');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/candidate.php';
require __DIR__ . '/admin.php';
