<?php

namespace Database\Seeders;

use App\Models\CandidatesLanguage;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CandidatesLanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all candidate users
        $candidates = User::where('role', UserRole::CANDIDATE)->get();

        if ($candidates->isEmpty()) {
            $this->command->info('No candidates found. Please run UserSeeder first.');
            return;
        }

        foreach ($candidates as $candidate) {
            // Always add Indonesian as native
            CandidatesLanguage::create([
                'user_id' => $candidate->id,
                'language_name' => 'Bahasa Indonesia (Native)',
                'certificate_file' => null,
            ]);

            // Add English with random proficiency
            $englishLevels = ['Fluent', 'Advanced', 'Intermediate', 'Basic'];
            $englishLevel = fake()->randomElement($englishLevels);
            CandidatesLanguage::create([
                'user_id' => $candidate->id,
                'language_name' => "English ($englishLevel)",
                'certificate_file' => fake()->optional(0.3)->passthrough("english_cert_" . $candidate->id . ".pdf"),
            ]);

            // Randomly add 1-2 additional languages
            $additionalLanguages = fake()->randomElements(
                ['Mandarin', 'Japanese', 'Korean', 'Arabic', 'Spanish', 'French', 'German', 'Dutch'],
                fake()->numberBetween(0, 2)
            );

            foreach ($additionalLanguages as $language) {
                $levels = ['Advanced', 'Intermediate', 'Basic'];
                $level = fake()->randomElement($levels);
                CandidatesLanguage::create([
                    'user_id' => $candidate->id,
                    'language_name' => "$language ($level)",
                    'certificate_file' => fake()->optional(0.2)->passthrough(strtolower($language) . "_cert_" . $candidate->id . ".pdf"),
                ]);
            }
        }

        $this->command->info('Candidates languages seeded successfully.');
    }
} 