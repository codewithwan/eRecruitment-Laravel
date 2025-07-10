<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\ApplicationHistory;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ApplicationHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all applications
        $applications = Application::with(['user', 'status', 'vacancyPeriod.period'])->get();
        
        if ($applications->isEmpty()) {
            $this->command->info('No applications found. Skipping application history seeding.');
            return;
        }

        // Get admin users for reviewers
        $adminUsers = User::whereIn('role', ['hr', 'head_hr', 'head_dev'])->get();
        
        if ($adminUsers->isEmpty()) {
            $this->command->info('No admin users found. Skipping application history seeding.');
            return;
        }

        // Get all status records
        $statuses = Status::all();
        $administrationStatus = $statuses->where('code', 'admin_selection')->first();
        $assessmentStatus = $statuses->where('code', 'psychotest')->first();
        $interviewStatus = $statuses->where('code', 'interview')->first();

        if (!$administrationStatus || !$assessmentStatus || !$interviewStatus) {
            $this->command->info('Required statuses not found. Skipping application history seeding.');
            return;
        }

        $this->command->info('Creating application history records...');

        foreach ($applications as $application) {
            $baseDate = Carbon::parse($application->created_at);
            $reviewer = $adminUsers->random();

            // Randomly decide how far this candidate has progressed
            $progress = rand(1, 4); // 1: admin only, 2: +assessment, 3: +interview incomplete, 4: all complete

            // Create administration history for all applications with score
            ApplicationHistory::create([
                'application_id' => $application->id,
                'status_id' => $administrationStatus->id,
                'processed_at' => $baseDate,
                'score' => rand(65, 95), // All candidates have admin score
                'notes' => $this->getRandomAdminNotes(),
                'scheduled_at' => null,
                'completed_at' => $baseDate->copy()->addDays(rand(1, 3)),
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => $baseDate->copy()->addDays(rand(1, 3)),
                'is_active' => true,
            ]);

            // If progressed beyond administration (progress >= 2)
            if ($progress >= 2) {
                $assessmentDate = $baseDate->copy()->addDays(5);
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $assessmentStatus->id,
                    'processed_at' => $assessmentDate,
                    'score' => rand(70, 95), // All who took assessment have score
                    'notes' => $this->getRandomAssessmentNotes(),
                    'scheduled_at' => $assessmentDate->copy()->addDays(2),
                    'completed_at' => $assessmentDate->copy()->addDays(3),
                    'reviewed_by' => $reviewer->id,
                    'reviewed_at' => $assessmentDate->copy()->addDays(3),
                    'is_active' => true,
                ]);
            }

            // If reached interview stage (progress >= 3)
            if ($progress >= 3) {
                $interviewDate = $baseDate->copy()->addDays(10);
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $interviewStatus->id,
                    'processed_at' => $interviewDate,
                    'score' => $progress === 4 ? rand(70, 95) : null, // Score only if completed (progress = 4)
                    'notes' => $this->getRandomInterviewNotes(),
                    'scheduled_at' => $interviewDate->copy()->addDays(2),
                    'completed_at' => $progress === 4 ? $interviewDate->copy()->addDays(3) : null,
                    'reviewed_by' => $reviewer->id,
                    'reviewed_at' => $progress === 4 ? $interviewDate->copy()->addDays(3) : null,
                    'is_active' => true,
                ]);

                // Update application status to interview
                $application->update(['status_id' => $interviewStatus->id]);
            }
            // If only reached assessment (progress = 2)
            else if ($progress === 2) {
                $application->update(['status_id' => $assessmentStatus->id]);
            }
            // If only at administration (progress = 1)
            else {
                $application->update(['status_id' => $administrationStatus->id]);
            }
        }

        $this->command->info('Application history seeding completed successfully.');
    }

    private function getRandomAdminNotes(): string
    {
        $notes = [
            "Documents complete and verified. Ready for next stage.",
            "All requirements met. Background check passed.",
            "Education background matches requirements perfectly.",
            "Experience matches job requirements. Strong potential.",
            "CV and cover letter well-prepared and impressive.",
        ];
        return $notes[array_rand($notes)];
    }

    private function getRandomAssessmentNotes(): string
    {
        $notes = [
            "Strong analytical skills demonstrated in technical test.",
            "Good problem-solving capabilities shown throughout assessment.",
            "Excellent technical knowledge in required areas.",
            "Passed all required tests with high scores.",
            "Shows great potential for growth and learning.",
        ];
        return $notes[array_rand($notes)];
    }

    private function getRandomInterviewNotes(): string
    {
        $notes = [
            "Technical interview completed - demonstrated strong problem-solving skills.",
            "HR interview completed - excellent communication and cultural fit.",
            "Final interview completed - shows great leadership potential.",
            "All interviews completed successfully - recommended for hiring.",
            "Technical and HR interviews completed - strong candidate overall.",
        ];
        return $notes[array_rand($notes)];
    }
} 