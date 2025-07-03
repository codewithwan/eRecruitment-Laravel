<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use App\Http\Controllers\PeriodController; // Add this import
use App\Http\Controllers\CompanyController; // Add this import
use App\Http\Controllers\AdministrationController; // Add this import
use App\Http\Controllers\AssessmentController; // Add this import
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

// API Routes
Route::prefix('api')->group(function () {
    Route::get('/vacancies', function () {
            return App\Models\Vacancies::with(['company', 'departement'])
        ->select('id', 'title', 'department_id', 'company_id')
            ->get()
            ->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->departement ? $vacancy->departement->name : 'Unknown',
                    'company' => $vacancy->company ? $vacancy->company->name : null,
                ];
            });
    });

    // Add a direct route for period with company API
    Route::get('/periods/{id}/with-company', [PeriodController::class, 'getPeriodWithCompany'])->name('api.periods.with-company');
});

// Company Management Routes (hanya index dan destroy)
Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::get('company-management', [App\Http\Controllers\Admin\CompanyManagementController::class, 'index'])
        ->name('company-management.index');
    Route::delete('company-management/{company}', [App\Http\Controllers\Admin\CompanyManagementController::class, 'destroy'])
        ->name('company-management.destroy');
});

Route::middleware(['auth'])->group(function () {
    // Company management routes
    Route::prefix('dashboard')->name('companies.')->group(function () {
        Route::get('/companies', [CompanyController::class, 'index'])->name('index');
        Route::get('/companies/create', [CompanyController::class, 'create'])->name('create');
        Route::post('/companies', [CompanyController::class, 'store'])->name('store');
        Route::get('/companies/{company}', [CompanyController::class, 'show'])->name('show');
        Route::get('/companies/{company}/edit', [CompanyController::class, 'edit'])->name('edit');
        Route::put('/companies/{company}', [CompanyController::class, 'update'])->name('update');
        Route::delete('/companies/{company}', [CompanyController::class, 'destroy'])->name('destroy');
        Route::get('/companies/{company}/periods', [CompanyController::class, 'periods'])->name('periods');
    });
    
    // Company routes for wizard navigation (keep existing ones if still needed)
    Route::prefix('dashboard/company')->name('company.')->group(function () {
        Route::get('/administration', [CompanyController::class, 'administration'])
            ->name('administration');
        
        Route::get('/assessment', [CompanyController::class, 'assessment'])
            ->name('assessment');
        
        Route::get('/interview', [CompanyController::class, 'interview'])
            ->name('interview');
        
        Route::get('/reports', [CompanyController::class, 'reports'])
            ->name('reports');
    });

    // Assessment routes
    Route::prefix('dashboard')->name('assessment.')->group(function () {
        Route::get('/assessment', [CompanyController::class, 'assessment'])
            ->name('index');
        
        Route::get('/assessment/detail/{id}', [AssessmentController::class, 'show'])
            ->name('detail');
        
        Route::post('/assessment/{id}/approve', [AssessmentController::class, 'approve'])
            ->name('approve');
        
        Route::post('/assessment/{id}/reject', [AssessmentController::class, 'reject'])
            ->name('reject');
    });

    // Administration routes
    Route::get('/dashboard/administration/{id}', [AdministrationController::class, 'show'])->name('administration.show');
    Route::post('/dashboard/administration/{id}/approve', [AdministrationController::class, 'approve'])->name('administration.approve');
    Route::post('/dashboard/administration/{id}/reject', [AdministrationController::class, 'reject'])->name('administration.reject');

    // Interview detail route
    Route::get('/dashboard/company/interview/{userId}', [App\Http\Controllers\CompanyController::class, 'interviewDetail'])->name('company.interview.detail');
    Route::post('/dashboard/company/interview/{id}/approve', [App\Http\Controllers\CompanyController::class, 'approveInterview'])->name('company.interview.approve');
    Route::post('/dashboard/company/interview/{id}/reject', [App\Http\Controllers\CompanyController::class, 'rejectInterview'])->name('company.interview.reject');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/candidate.php';
require __DIR__ . '/admin.php';
