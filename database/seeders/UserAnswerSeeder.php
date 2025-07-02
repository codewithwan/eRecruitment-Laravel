<?php

namespace Database\Seeders;

use App\Models\UserAnswer;
use App\Models\User;
use App\Models\Question;
use App\Models\Choice;
use Illuminate\Database\Seeder;

class UserAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $candidateUsers = User::where('role', 'candidate')->get();
        $questions = Question::with('choices')->get();

        if ($candidateUsers->isEmpty()) {
            $this->command->error('No candidate users found. Please run UserSeeder first.');
            return;
        }

        if ($questions->isEmpty()) {
            $this->command->error('No questions found. Please run QuestionSeeder first.');
            return;
        }

        $totalAnswers = 0;

        foreach ($candidateUsers as $user) {
            // Each candidate answers 60-90% of available questions randomly
            $questionsToAnswer = $questions->random(rand(
                (int)($questions->count() * 0.6), 
                (int)($questions->count() * 0.9)
            ));

            foreach ($questionsToAnswer as $question) {
                if ($question->choices->isNotEmpty()) {
                    // Simulate realistic answer patterns:
                    // 30% chance of correct answer
                    // 70% chance of random answer (which might still be correct)
                    $shouldAnswerCorrectly = fake()->boolean(30);
                    
                    if ($shouldAnswerCorrectly) {
                        $correctChoice = $question->choices->where('is_correct', true)->first();
                        $selectedChoice = $correctChoice ?: $question->choices->random();
                    } else {
                        $selectedChoice = $question->choices->random();
                    }

                    // Prevent duplicate answers for same user-question combination
                    UserAnswer::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'question_id' => $question->id,
                        ],
                        [
                            'choice_id' => $selectedChoice->id,
                        ]
                    );

                    $totalAnswers++;
                }
            }
        }

        $this->command->info("UserAnswer seeder completed successfully.");
        $this->command->info("Created {$totalAnswers} user answers for " . $candidateUsers->count() . " candidates.");
        $this->command->info("Average answers per candidate: " . round($totalAnswers / $candidateUsers->count(), 1));
    }
} 