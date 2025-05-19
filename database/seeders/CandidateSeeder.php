<?php

namespace Database\Seeders;

use App\Enums\CandidatesStage;
use App\Enums\UserRole;
use App\Models\Candidate;
use App\Models\User;
use App\Models\Vacancies;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CandidateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all candidate users
        $candidateUsers = User::where('role', UserRole::CANDIDATE->value)->get();

        // Get available vacancies (assuming you have some vacancies already seeded)
        $vacancies = Vacancies::all();

        if ($vacancies->isEmpty() || $candidateUsers->isEmpty()) {
            // If no vacancies or candidates exist, skip
            return;
        }

        // Pastikan user dan vacancy pertama ada
        $firstUser = $candidateUsers->first();
        $firstVacancy = $vacancies->first();

        if ($firstUser && $firstVacancy && !Candidate::where('id', 1)->exists()) {
            Candidate::create([
                'id' => 1,
                'user_id' => $firstUser->id,
                'vacancy_id' => $firstVacancy->id,
                'applied_at' => Carbon::now(),
                'status' => CandidatesStage::ADMINISTRATIVE_SELECTION->value,
            ]);
        }

        // Application traffic distribution over the last 7 days
        $dayDistribution = [
            1 => 10,  // Yesterday: 10 applications
            2 => 7,   // 2 days ago: 7 applications
            3 => 12,  // 3 days ago: 12 applications
            4 => 5,   // 4 days ago: 5 applications
            5 => 8,   // 5 days ago: 8 applications
            6 => 6,   // 6 days ago: 6 applications
            7 => 9,   // 7 days ago: 9 applications
        ];

        // Create applications based on day distribution
        $userIndex = 0;

        foreach ($dayDistribution as $daysAgo => $applicationsCount) {
            $date = Carbon::now()->subDays($daysAgo);

            for ($i = 0; $i < $applicationsCount; $i++) {
                // Get a user (cycling through available users)
                $user = $candidateUsers[$userIndex % count($candidateUsers)];
                $userIndex++;

                // Get a random vacancy
                $vacancy = $vacancies->random();

                // Create the application with timestamp from the specific day
                Candidate::create([
                    'user_id' => $user->id,
                    'vacancy_id' => $vacancy->id,
                    'applied_at' => $date->copy()->addHours(rand(8, 20))->addMinutes(rand(0, 59)), // Random time between 8 AM and 8 PM
                    'status' => CandidatesStage::ADMINISTRATIVE_SELECTION->value,
                ]);
            }
        }
    }
}
