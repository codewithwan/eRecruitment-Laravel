<?php

use App\Enums\UserRole;
use App\Models\Assessment;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create([
        'role' => UserRole::HR->value,
    ]);

    $this->assessment = Assessment::factory()->create([
        'title' => 'Test Assessment',
        'description' => 'Description for test assessment',
        'test_type' => 'multiple_choice',
        'duration' => '1:30',
    ]);
});

test('hr can view question management page', function () {
    $response = $this->actingAs($this->user)
        ->get(route('admin.questions.info'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/questions/question-management'));
});

test('hr can view create question page', function () {
    $response = $this->actingAs($this->user)
        ->get(route('admin.questions.create'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/questions/add-questions'));
});

test('hr can create questions within an assessment', function () {
    $questionData = [
        'title' => 'New Assessment',
        'description' => 'Assessment Description',
        'test_type' => 'multiple_choice',
        'duration' => '1:00',
        'questions' => [
            [
                'question' => 'What is PHP?',
                'options' => ['A programming language', 'A database', 'A web server', 'An operating system'],
                'correct_answer' => 0,
            ],
            [
                'question' => 'What does HTML stand for?',
                'options' => ['Hyper Text Markup Language', 'High Tech Machine Learning', 'Home Tool Management Language'],
                'correct_answer' => 0,
            ],
        ],
    ];

    $response = $this->actingAs($this->user)
        ->post(route('admin.questions.store'), $questionData);

    $response->assertRedirect(route('admin.questions.info'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('assessments', [
        'title' => 'New Assessment',
        'test_type' => 'multiple_choice',
    ]);

    $this->assertDatabaseHas('questions', [
        'question_text' => 'What is PHP?',
    ]);

    $this->assertDatabaseHas('questions', [
        'question_text' => 'What does HTML stand for?',
    ]);
});

test('hr can edit existing questions', function () {
    $question = Question::create([
        'assessment_id' => $this->assessment->id,
        'question_text' => 'Original question?',
        'options' => ['Option 1', 'Option 2', 'Option 3'],
    ]);

    $response = $this->actingAs($this->user)
        ->get(route('admin.questions.edit', $this->assessment));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/questions/edit-questions')
        ->has('assessment.questions')
    );
});

test('hr can update assessment with questions', function () {
    $question = Question::create([
        'assessment_id' => $this->assessment->id,
        'question_text' => 'Original question?',
        'options' => ['Option 1', 'Option 2', 'Option 3'],
    ]);

    $updatedData = [
        'title' => 'Updated Assessment',
        'description' => 'Updated Description',
        'test_type' => 'multiple_choice',
        'duration' => '2:00',
        'questions' => json_encode([
            [
                'question_text' => 'Updated question text?',
                'options' => ['New Option 1', 'New Option 2', 'New Option 3'],
            ],
        ]),
    ];

    $response = $this->actingAs($this->user)
        ->put(route('admin.questions.update', $this->assessment), $updatedData);

    $response->assertRedirect(route('admin.questions.info'));

    $this->assertDatabaseHas('assessments', [
        'id' => $this->assessment->id,
        'title' => 'Updated Assessment',
        'duration' => '2:00',
    ]);

    $this->assertDatabaseHas('questions', [
        'assessment_id' => $this->assessment->id,
        'question_text' => 'Updated question text?',
    ]);
});
