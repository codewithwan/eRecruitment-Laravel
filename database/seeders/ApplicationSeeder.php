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

        // Get status records
        $administrationStatus = Status::where('code', 'admin_selection')->first();
        $assessmentStatus = Status::where('code', 'psychotest')->first();
        $interviewStatus = Status::where('code', 'interview')->first();

        if (!$administrationStatus || !$assessmentStatus || !$interviewStatus) {
            $this->command->info('Required statuses not found. Skipping application seeding.');
            return;
        }

        $this->command->info('Creating applications...');

        // Take only first 2 vacancy periods to keep it simple
        $selectedVacancyPeriods = $vacancyPeriods->take(2);

        foreach ($selectedVacancyPeriods as $vacancyPeriod) {
            // Get the period's start date
            $periodStartDate = Carbon::parse($vacancyPeriod->period->start_time);
            
            // Randomly select 3-5 candidates for each vacancy period
            $selectedCandidates = $candidates->random(rand(3, 5));

            foreach ($selectedCandidates as $index => $candidate) {
                // Calculate a random application date within the period
                $applicationDate = $periodStartDate->copy()->addDays(rand(1, 10));
                
                // Determine status based on application index for demo purposes
                $statusId = match($index % 3) {
                    0 => $administrationStatus->id,    // Still in administration
                    1 => $assessmentStatus->id,        // In assessment stage  
                    2 => $interviewStatus->id,         // In interview stage
                    default => $administrationStatus->id
                };

                // Create the application
                Application::create([
                    'user_id' => $candidate->id,
                    'vacancy_period_id' => $vacancyPeriod->id,
                    'status_id' => $statusId, // Current stage of the candidate
                    'resume_path' => 'resumes/dummy-resume-' . $candidate->id . '.pdf',
                    'cover_letter_path' => 'cover-letters/dummy-cover-letter-' . $candidate->id . '.pdf',
                    'created_at' => $applicationDate,
                    'updated_at' => $applicationDate,
                ]);
            }
        }

        $this->command->info('Application seeding completed successfully.');
    }
} 