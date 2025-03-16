<?php

use App\Models\User;
use App\Enums\UserRole;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    // Create a user with HR role to ensure they have proper permissions
    $user = User::factory()->create([
        'email_verified_at' => now(),  
        'role'              => UserRole::HR->value, 
    ]);

    $this->actingAs($user);

    // Make the request and check for 200 OK status
    $response = $this->get('/dashboard');
    $response->assertStatus(200);
});

// Updated test for regular users to match actual application behavior
test('regular users are forbidden from accessing dashboard', function () {
    $regularUser = User::factory()->create([
        'email_verified_at' => now(),
        'role'              => UserRole::CANDIDATE->value, 
    ]);

    $this->actingAs($regularUser);

    // Regular users (CANDIDATE role) should get a 403 Forbidden when trying to access /dashboard
    $this->get('/dashboard')->assertStatus(403);
});
