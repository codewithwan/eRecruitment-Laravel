<?php

use App\Enums\UserRole;
use App\Models\Assessment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create([
        'role' => UserRole::HR->value,
    ]);
});

test('hr can create a new assessment', function () {
    $assessmentData = [
        'title' => 'Programming Test',
        'description' => 'Test for programming skills',
        'test_type' => 'technical',
        'duration' => '2:30',
        'questions' => [
            [
                'question' => 'What is a closure in PHP?',
                'options' => ['Anonymous function', 'Class method', 'Interface', 'Abstract class'],
                'correct_answer' => 0,
            ],
        ],
    ];

    $response = $this->actingAs($this->user)
        ->post(route('admin.questions.store'), $assessmentData);

    $response->assertRedirect(route('admin.questions.info'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('assessments', [
        'title' => 'Programming Test',
        'test_type' => 'technical',
        'duration' => '2:30',
    ]);
});

test('assessment requires valid data', function () {
    $invalidData = [
        'title' => '', // Empty title should fail validation
        'description' => 'Test description',
        'test_type' => 'invalid_type',   // Invalid test type
        'duration' => 'not-a-duration', // Invalid duration format
        'questions' => [],               // Empty questions array
    ];

    $response = $this->actingAs($this->user)
        ->post(route('admin.questions.store'), $invalidData);

    $response->assertSessionHasErrors(['title', 'test_type', 'duration', 'questions']);
});

test('assessment can be retrieved with questions', function () {
    $assessment = Assessment::create([
        'title' => 'Test Assessment',
        'description' => 'Test Description',
        'test_type' => 'multiple_choice',
        'duration' => '1:30',
    ]);

    $assessment->questions()->create([
        'question_text' => 'Sample Question 1',
        'options' => ['Option A', 'Option B', 'Option C'],
    ]);

    $assessment->questions()->create([
        'question_text' => 'Sample Question 2',
        'options' => ['Option X', 'Option Y', 'Option Z'],
    ]);

    $response = $this->actingAs($this->user)
        ->get(route('admin.questions.edit', $assessment));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/questions/edit-questions')
        ->has('assessment')
        ->has('assessment.questions', 2)
    );
});

test('assessment with questions can be updated', function () {
    $assessment = Assessment::create([
        'title' => 'Original Assessment',
        'description' => 'Original Description',
        'test_type' => 'multiple_choice',
        'duration' => '1:00',
    ]);

    $assessment->questions()->create([
        'question_text' => 'Original Question',
        'options' => ['Option 1', 'Option 2'],
    ]);

    $updatedData = [
        'title' => 'Updated Assessment Title',
        'description' => 'Updated Description',
        'test_type' => 'essay',
        'duration' => '1:45',
        'questions' => json_encode([
            [
                'question_text' => 'New Question 1',
                'options' => ['New Option A', 'New Option B'],
            ],
            [
                'question_text' => 'New Question 2',
                'options' => ['New Option X', 'New Option Y', 'New Option Z'],
            ],
        ]),
    ];

    $response = $this->actingAs($this->user)
        ->put(route('admin.questions.update', $assessment), $updatedData);

    $response->assertRedirect(route('admin.questions.info'));

    $this->assertDatabaseHas('assessments', [
        'id' => $assessment->id,
        'title' => 'Updated Assessment Title',
        'test_type' => 'essay',
        'duration' => '1:45',
    ]);

    $this->assertDatabaseHas('questions', [
        'assessment_id' => $assessment->id,
        'question_text' => 'New Question 1',
    ]);

    $this->assertDatabaseHas('questions', [
        'assessment_id' => $assessment->id,
        'question_text' => 'New Question 2',
    ]);

    // Original question should be deleted
    $this->assertDatabaseMissing('questions', [
        'assessment_id' => $assessment->id,
        'question_text' => 'Original Question',
    ]);
});

test('assessments list is displayed correctly', function () {
    // Create some assessments
    Assessment::create([
        'title' => 'Assessment 1',
        'description' => 'Description 1',
        'test_type' => 'multiple_choice',
        'duration' => '1:00',
    ]);

    Assessment::create([
        'title' => 'Assessment 2',
        'description' => 'Description 2',
        'test_type' => 'essay',
        'duration' => '0:45',
    ]);

    $response = $this->actingAs($this->user)
        ->get(route('admin.questions.info'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/questions/question-management')
        ->has('tests', 2)
    );
});
