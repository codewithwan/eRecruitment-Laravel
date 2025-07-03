<?php

namespace Database\Seeders;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\ApplicationReport;
use App\Models\Status;
use App\Models\User;
use App\Models\VacancyPeriods;
use App\Models\QuestionPack;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'candidate')->get();
        $vacancyPeriods = VacancyPeriods::all();
        $statuses = Status::all();

        // Check if we have required data
        if ($users->isEmpty()) {
            $this->command->error('No candidate users found. Please run UserSeeder first.');
            return;
        }

        if ($vacancyPeriods->isEmpty()) {
            $this->command->error('No vacancy periods found. Please run VacanciesSeeder and PeriodSeeder first.');
            return;
        }

        if ($statuses->isEmpty()) {
            $this->command->error('No statuses found. Please create some status records first.');
            return;
        }
        
        // Get status IDs for common statuses
        $statusCodes = ['admin_selection', 'psychotest', 'interview', 'accepted', 'rejected'];
        $statusMap = [];
        
        foreach ($statusCodes as $code) {
            $status = $statuses->where('code', $code)->first();
            if ($status) {
                $statusMap[$code] = $status->id;
            }
        }

        $totalApplications = 0;

        // Create realistic applications
        foreach ($users as $user) {
            // Each user applies to 1-3 random vacancy periods
            $applicationCount = min(rand(1, 3), $vacancyPeriods->count());
            $selectedVacancyPeriods = $vacancyPeriods->random($applicationCount);

            foreach ($selectedVacancyPeriods as $vacancyPeriod) {
                $totalApplications++;
                
                // Create the application
                $appliedAt = fake()->dateTimeBetween('-60 days', '-30 days');
                
                // Randomly assign status based on realistic distribution
                $randomStatus = $this->getRandomStatus($statusMap);
                
                $application = Application::create([
                    'user_id' => $user->id,
                    'vacancy_period_id' => $vacancyPeriod->id,
                    'status_id' => $randomStatus,
                    'resume_path' => 'resumes/user_' . $user->id . '_resume.pdf',
                    'cover_letter_path' => 'cover_letters/user_' . $user->id . '_cover.pdf',
                    'created_at' => $appliedAt,
                    'updated_at' => $appliedAt,
                ]);
            }
        }

        $this->command->info("Created {$totalApplications} applications");
    }

    private function getRandomStatus($statusMap): int
    {
        // Distribution: 30% admin_selection, 25% psychotest, 20% interview, 15% accepted, 10% rejected
        $rand = rand(1, 100);
        
        if ($rand <= 30 && isset($statusMap['admin_selection'])) {
            return $statusMap['admin_selection'];
        } elseif ($rand <= 55 && isset($statusMap['psychotest'])) {
            return $statusMap['psychotest'];
        } elseif ($rand <= 75 && isset($statusMap['interview'])) {
            return $statusMap['interview'];
        } elseif ($rand <= 90 && isset($statusMap['accepted'])) {
            return $statusMap['accepted'];
        } else {
            return $statusMap['rejected'] ?? $statusMap['admin_selection'];
        }
    }
} 