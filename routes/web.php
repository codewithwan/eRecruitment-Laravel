<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
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

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/candidate.php';
require __DIR__ . '/admin.php';
