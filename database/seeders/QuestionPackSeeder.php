<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Question;
use App\Models\QuestionPack;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuestionPackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get an HR user to associate with the question packs
        $user = User::where('role', UserRole::HR->value)->first();
        
        if (!$user) {
            $this->command->info('No HR user found. Skipping question pack seeding.');
            return;
        }
        
        // Create question packs
        $questionPacks = [
            [
                'pack_name' => 'General Assessment',
                'description' => 'Basic assessment for all candidates',
                'test_type' => 'general',
                'duration' => 30,
                'user_id' => $user->id,
                'status' => 'active'
            ],
            [
                'pack_name' => 'Technical Assessment',
                'description' => 'Technical assessment for IT positions',
                'test_type' => 'technical',
                'duration' => 45,
                'user_id' => $user->id,
                'status' => 'active'
            ],
            [
                'pack_name' => 'Leadership Assessment',
                'description' => 'Assessment for managerial positions',
                'test_type' => 'leadership',
                'duration' => 60,
                'user_id' => $user->id,
                'status' => 'draft'
            ]
        ];

        foreach ($questionPacks as $packData) {
            $pack = QuestionPack::create($packData);
            
            // Attach some random questions to each pack
            $questions = Question::inRandomOrder()->take(rand(3, 5))->get();
            foreach ($questions as $question) {
                $pack->questions()->attach($question->id);
            }
        }
    }
}