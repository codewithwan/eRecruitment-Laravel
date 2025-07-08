<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Status;
use App\Models\User;
use App\Models\VacancyPeriods;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        // Get all vacancy periods
        $vacancyPeriods = VacancyPeriods::with('vacancy')->get();
        
        // Get all users with role 'candidate'
        $candidates = User::where('role', 'candidate')->get();
        
        if ($vacancyPeriods->isEmpty() || $candidates->isEmpty()) {
            $this->command->info('No vacancy periods or candidates found. Skipping application seeding.');
            return;
        }

        // Get all status records
        $statuses = Status::all();
        $administrationStatus = $statuses->where('code', 'admin_selection')->first();
        $assessmentStatus = $statuses->where('code', 'psychotest')->first();
        $interviewStatus = $statuses->where('code', 'interview')->first();

        if (!$administrationStatus || !$assessmentStatus || !$interviewStatus) {
            $this->command->info('Required statuses not found. Skipping application seeding.');
            return;
        }

        $this->command->info('Creating applications for each vacancy period...');

        // Create applications for each vacancy period
        foreach ($vacancyPeriods as $vacancyPeriod) {
            // Get the period's start date
            $periodStartDate = Carbon::parse($vacancyPeriod->period->start_time);
            
            // Randomly select 5-10 candidates for each vacancy period
            $selectedCandidates = $candidates->random(rand(5, 10));

            foreach ($selectedCandidates as $candidate) {
                // Calculate a random application date within the period
                $applicationDate = $periodStartDate->copy()->addDays(rand(1, 30));
                
                // Determine random status for this application with weighted probabilities
                $statusId = $this->getRandomWeightedStatus([
                    $administrationStatus->id => 50,  // 50% in administration
                    $assessmentStatus->id => 30,      // 30% in assessment
                    $interviewStatus->id => 20        // 20% in interview
                ]);

                // Create the application
                Application::create([
                    'user_id' => $candidate->id,
                    'vacancy_period_id' => $vacancyPeriod->id,
                    'status_id' => $statusId,
                    'resume_path' => 'resumes/dummy-resume-' . $candidate->id . '.pdf',
                    'cover_letter_path' => 'cover-letters/dummy-cover-letter-' . $candidate->id . '.pdf',
                    'created_at' => $applicationDate,
                    'updated_at' => $applicationDate,
                ]);
            }
        }

        $this->command->info('Application seeding completed successfully.');
    }

    private function getRandomWeightedStatus(array $weights): int
    {
        $rand = rand(1, 100);
        $total = 0;

        foreach ($weights as $statusId => $weight) {
            $total += $weight;
            if ($rand <= $total) {
                return $statusId;
            }
        }

        return array_key_first($weights);
    }
} 