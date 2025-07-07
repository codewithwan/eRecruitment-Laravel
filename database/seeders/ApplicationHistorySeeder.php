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

            // Create administration history for all applications
            ApplicationHistory::create([
                'application_id' => $application->id,
                'status_id' => $administrationStatus->id,
                'processed_at' => $baseDate,
                'score' => null,
                'notes' => $this->getRandomAdminNotes(),
                'scheduled_at' => null,
                'completed_at' => $baseDate->copy()->addDays(rand(1, 3)),
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => $baseDate->copy()->addDays(rand(1, 3)),
                'is_active' => $application->status_id === $administrationStatus->id,
            ]);

            // If application has progressed beyond administration
            if (in_array($application->status_id, [$assessmentStatus->id, $interviewStatus->id])) {
                $assessmentDate = $baseDate->copy()->addDays(5);
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $assessmentStatus->id,
                    'processed_at' => $assessmentDate,
                    'score' => rand(70, 100), // Random score between 70-100
                    'notes' => $this->getRandomAssessmentNotes(),
                    'scheduled_at' => $assessmentDate->copy()->addDays(2),
                    'completed_at' => $assessmentDate->copy()->addDays(3),
                    'reviewed_by' => $reviewer->id,
                    'reviewed_at' => $assessmentDate->copy()->addDays(3),
                    'is_active' => $application->status_id === $assessmentStatus->id,
                ]);
            }

            // If application has reached interview stage
            if ($application->status_id === $interviewStatus->id) {
                $interviewDate = $baseDate->copy()->addDays(10);
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $interviewStatus->id,
                    'processed_at' => $interviewDate,
                    'score' => null,
                    'notes' => $this->getRandomInterviewNotes(),
                    'scheduled_at' => $interviewDate->copy()->addDays(2),
                    'completed_at' => null, // Interview not completed yet
                    'reviewed_by' => $reviewer->id,
                    'reviewed_at' => null,
                    'is_active' => true,
                ]);
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
            "Scheduled for technical interview with team lead.",
            "HR interview scheduled - initial screening complete.",
            "Final interview with department head pending.",
            "Follow-up interview required to assess cultural fit.",
            "Technical interview scheduled with senior engineer.",
        ];
        return $notes[array_rand($notes)];
    }
} 