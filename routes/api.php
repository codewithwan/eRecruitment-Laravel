<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Vacancies;

// ...existing code...

// Route for getting vacancies to use in periods selection dropdown
Route::get('/vacancies/periods', function () {
    return Vacancies::select('id', 'start_date', 'end_date')
        ->whereNotNull('start_date')
        ->whereNotNull('end_date')
        ->orderBy('start_date', 'desc')
        ->get()
        ->map(function ($vacancy) {
            return [
                'id' => $vacancy->id,
                'start_date' => $vacancy->start_date ? $vacancy->start_date->format('d/m/Y') : null,
                'end_date' => $vacancy->end_date ? $vacancy->end_date->format('d/m/Y') : null,
            ];
        });
});

// ...existing code...