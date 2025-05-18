<?php

use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/candidate/dashboard', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});