<?php

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Vacancies;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('HR users can access the user management page', function () {
    $hrUser = User::factory()->create([
        'email_verified_at' => now(),
        'role' => UserRole::HR->value,
    ]);

    $this->actingAs($hrUser)
        ->get('/dashboard/users')
        ->assertStatus(200);
});

test('HR users can access the jobs management page', function () {
    $hrUser = User::factory()->create([
        'email_verified_at' => now(),
        'role' => UserRole::HR->value,
    ]);

    $this->actingAs($hrUser)
        ->get('/dashboard/jobs')
        ->assertStatus(200);
});

test('HR users can create new job vacancies', function () {
    $hrUser = User::factory()->create([
        'email_verified_at' => now(),
        'role' => UserRole::HR->value,
    ]);

    $jobData = [
        'title' => 'Software Engineer',
        'department' => 'Engineering',
        'location' => 'Jakarta',
        'requirements' => ['PHP', 'Laravel', 'Vue.js'],
        'benefits' => ['Health Insurance', 'Remote Work'],
    ];

    $this->actingAs($hrUser)
        ->postJson('/dashboard/jobs', $jobData)
        ->assertStatus(201)
        ->assertJsonPath('message', 'Job created successfully')
        ->assertJsonStructure([
            'message',
            'job' => [
                'id', 'title', 'department', 'location', 'requirements', 'benefits',
            ],
        ]);

    $this->assertDatabaseHas('vacancies', [
        'title' => 'Software Engineer',
        'department' => 'Engineering',
        'location' => 'Jakarta',
    ]);
});

test('HR users can update existing job vacancies', function () {
    $hrUser = User::factory()->create([
        'email_verified_at' => now(),
        'role' => UserRole::HR->value,
    ]);

    $job = Vacancies::create([
        'user_id' => $hrUser->id,
        'title' => 'Old Job Title',
        'department' => 'Old Department',
        'location' => 'Old Location',
        'requirements' => ['Old Requirement'],
        'benefits' => ['Old Benefit'],
    ]);

    $updatedData = [
        'title' => 'Updated Job Title',
        'department' => 'Updated Department',
        'location' => 'Updated Location',
        'requirements' => ['Updated Requirement'],
        'benefits' => ['Updated Benefit'],
    ];

    $this->actingAs($hrUser)
        ->putJson("/dashboard/jobs/{$job->id}", $updatedData)
        ->assertStatus(200)
        ->assertJsonPath('message', 'Job updated successfully');

    $this->assertDatabaseHas('vacancies', [
        'id' => $job->id,
        'title' => 'Updated Job Title',
        'department' => 'Updated Department',
        'location' => 'Updated Location',
    ]);
});

test('HR users can delete job vacancies', function () {
    $hrUser = User::factory()->create([
        'email_verified_at' => now(),
        'role' => UserRole::HR->value,
    ]);

    $job = Vacancies::create([
        'user_id' => $hrUser->id,
        'title' => 'Job to Delete',
        'department' => 'Test Department',
        'location' => 'Test Location',
        'requirements' => ['Test Requirement'],
        'benefits' => ['Test Benefit'],
    ]);

    $this->actingAs($hrUser)
        ->deleteJson("/dashboard/jobs/{$job->id}")
        ->assertStatus(200)
        ->assertJsonPath('message', 'Job deleted successfully');

    $this->assertDatabaseMissing('vacancies', ['id' => $job->id]);
});
