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
        // Get candidate users who don't already have a candidate record
        $existingCandidateUserIds = Candidate::pluck('user_id')->toArray();
        $candidateUsers = User::where('role', UserRole::CANDIDATE->value)
                            ->whereNotIn('id', $existingCandidateUserIds)
                            ->get();

        // Get available vacancies (assuming you have some vacancies already seeded)
        $vacancies = Vacancies::all();

        if ($vacancies->isEmpty() || $candidateUsers->isEmpty()) {
            $this->command->info('No vacancies or available candidate users found. Skipping candidate seeding.');
            return;
        }

        $this->command->info('Found ' . $candidateUsers->count() . ' available candidate users.');

        // Application traffic distribution over the last 7 days
        $dayDistribution = [
            1 => 3,  // Yesterday: 3 applications (reduced numbers)
            2 => 2,  // 2 days ago: 2 applications
            3 => 4,  // 3 days ago: 4 applications
            4 => 2,  // 4 days ago: 2 applications
            5 => 3,  // 5 days ago: 3 applications
            6 => 2,  // 6 days ago: 2 applications
            7 => 3,  // 7 days ago: 3 applications
        ];

        // Adjust distribution if we don't have enough users
        $totalApplications = array_sum($dayDistribution);
        if ($totalApplications > $candidateUsers->count()) {
            $this->command->info('Adjusting application distribution to match available users.');
            $factor = $candidateUsers->count() / $totalApplications;
            foreach ($dayDistribution as $day => $count) {
                $dayDistribution[$day] = max(1, floor($count * $factor));
            }
        }

        // Create applications based on day distribution
        $userIndex = 0;

        foreach ($dayDistribution as $daysAgo => $applicationsCount) {
            // Break if we've used all available users
            if ($userIndex >= $candidateUsers->count()) {
                break;
            }
            
            $date = Carbon::now()->subDays($daysAgo);

            for ($i = 0; $i < $applicationsCount && $userIndex < $candidateUsers->count(); $i++) {
                // Get a user (no cycling, use each user only once)
                $user = $candidateUsers[$userIndex];
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
        
        $this->command->info('Created ' . $userIndex . ' new candidate records.');
    }
}
