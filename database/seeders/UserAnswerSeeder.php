<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\UserAnswer;
use App\Models\Choice;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserAnswerSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing user answers first
        UserAnswer::truncate();
        
        // Get applications that are in assessment or interview stage
        $applications = Application::with([
            'user',
            'vacancyPeriod.vacancy.questionPack.questions.choices'
        ])->whereHas('status', function($query) {
            $query->whereIn('code', ['psychotest', 'interview']);
        })->get();

        if ($applications->isEmpty()) {
            $this->command->info('No applications in assessment/interview stage found.');
            return;
        }

        $this->command->info('Creating user answers for assessment...');

        foreach ($applications as $application) {
            $questionPack = $application->vacancyPeriod->vacancy->questionPack;
            
            if (!$questionPack || $questionPack->questions->isEmpty()) {
                $this->command->info("Skipping application {$application->id} - no question pack or questions");
                continue;
            }

            $this->command->info("Creating answers for user {$application->user->name} for vacancy {$application->vacancyPeriod->vacancy->title}");

            // Create answers for each question in the pack
            foreach ($questionPack->questions as $question) {
                $choices = $question->choices;
                
                if ($choices->isEmpty()) {
                    continue;
                }

                // Simulate realistic answer patterns:
                // 70% chance of correct answer for good performance
                $isCorrect = rand(1, 100) <= 70;
                
                if ($isCorrect) {
                    $selectedChoice = $choices->where('is_correct', true)->first();
                    if (!$selectedChoice) {
                        // Fallback to random choice if no correct answer found
                        $selectedChoice = $choices->random();
                    }
                } else {
                    // Select a wrong answer
                    $wrongChoices = $choices->where('is_correct', false);
                    if ($wrongChoices->isNotEmpty()) {
                        $selectedChoice = $wrongChoices->random();
                    } else {
                        // If no wrong choices, select any random choice
                        $selectedChoice = $choices->random();
                    }
                }

                if ($selectedChoice) {
                    UserAnswer::create([
                        'user_id' => $application->user_id,
                        'question_id' => $question->id,
                        'choice_id' => $selectedChoice->id,
                    ]);
                }
            }
        }

        $this->command->info('User answers seeding completed successfully.');
    }
} 