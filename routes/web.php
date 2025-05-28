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

// Periods routes moved to admin.php

// API Routes
Route::prefix('api')->group(function () {
    Route::get('/vacancies', function () {
        return App\Models\Vacancies::with('company')
            ->select('id', 'title', 'department', 'company_id')
            ->get()
            ->map(function ($vacancy) {
                return [
                    'id' => $vacancy->id,
                    'title' => $vacancy->title,
                    'department' => $vacancy->department,
                    'company' => $vacancy->company ? $vacancy->company->name : null,
                ];
            });
    });
});
Route::middleware(['auth'])->group(function () {
    // Period routes moved to admin.php
    
    // Company administration route
    Route::get('/dashboard/company/administration', [CompanyController::class, 'administration'])
        ->name('company.administration');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/candidate.php';
require __DIR__ . '/admin.php';
