<?php

use App\Enums\UserRole;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
        'role' => UserRole::HR->value,
    ]);

    $this->actingAs($user);

    $response = $this->get('/dashboard');
    $response->assertStatus(200);
});

test('candidate only show candidate page', function () {
    $regularUser = User::factory()->create([
        'email_verified_at' => now(),
        'role' => UserRole::CANDIDATE->value,
    ]);

    $this->actingAs($regularUser);

    $this->get('/candidate')->assertStatus(200);
});
