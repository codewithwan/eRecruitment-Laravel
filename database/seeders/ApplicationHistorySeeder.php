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
        $administrationStatus = Status::where('code', 'admin_selection')->first();
        $assessmentStatus = Status::where('code', 'psychotest')->first();
        $interviewStatus = Status::where('code', 'interview')->first();

        if (!$administrationStatus || !$assessmentStatus || !$interviewStatus) {
            $this->command->info('Required statuses not found. Skipping application history seeding.');
            return;
        }

        $this->command->info('Creating application history records...');

        foreach ($applications as $application) {
            $baseDate = Carbon::parse($application->created_at);
            $reviewer = $adminUsers->random();

            // Logic berdasarkan status_id aplikasi saat ini
            $currentStatusId = $application->status_id;

            if ($currentStatusId == $administrationStatus->id) {
                // Kandidat masih di tahap administrasi - belum dinilai
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $administrationStatus->id,
                    'processed_at' => $baseDate,
                    'score' => null, // Belum dinilai
                    'notes' => null,
                    'scheduled_at' => null,
                    'completed_at' => null,
                    'reviewed_by' => null,
                    'reviewed_at' => null,
                    'is_active' => true,
                ]);

            } elseif ($currentStatusId == $assessmentStatus->id) {
                // Kandidat di tahap assessment - sudah lolos administrasi
                
                // 1. History administrasi (completed dengan score)
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $administrationStatus->id,
                    'processed_at' => $baseDate,
                    'score' => rand(75, 95), // Lolos dengan score tinggi
                    'notes' => $this->getRandomAdminNotes(),
                    'scheduled_at' => null,
                    'completed_at' => $baseDate->copy()->addDays(2),
                    'reviewed_by' => $reviewer->id,
                    'reviewed_at' => $baseDate->copy()->addDays(2),
                    'is_active' => false, // Tidak aktif karena sudah selesai
                ]);

                // 2. History assessment (current stage - belum dinilai, tapi sudah ada UserAnswer)
                $assessmentDate = $baseDate->copy()->addDays(3);
                
                // Calculate assessment score based on user answers (if any)
                $assessmentScore = $this->calculateAssessmentScore($application);
                
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $assessmentStatus->id,
                    'processed_at' => $assessmentDate,
                    'score' => $assessmentScore > 0 ? $assessmentScore : null, // Score dari UserAnswer jika ada
                    'notes' => $assessmentScore > 0 ? $this->getRandomAssessmentNotes() : null,
                    'scheduled_at' => $assessmentDate->copy()->addDays(1),
                    'completed_at' => $assessmentScore > 0 ? $assessmentDate->copy()->addDays(2) : null,
                    'reviewed_by' => $assessmentScore > 0 ? $reviewer->id : null,
                    'reviewed_at' => $assessmentScore > 0 ? $assessmentDate->copy()->addDays(3) : null,
                    'is_active' => true,
                ]);

            } elseif ($currentStatusId == $interviewStatus->id) {
                // Kandidat di tahap interview - sudah lolos administrasi dan assessment
                
                // 1. History administrasi (completed)
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $administrationStatus->id,
                    'processed_at' => $baseDate,
                    'score' => rand(75, 95),
                    'notes' => $this->getRandomAdminNotes(),
                    'scheduled_at' => null,
                    'completed_at' => $baseDate->copy()->addDays(2),
                    'reviewed_by' => $reviewer->id,
                    'reviewed_at' => $baseDate->copy()->addDays(2),
                    'is_active' => false,
                ]);

                // 2. History assessment (completed dengan score berdasarkan jawaban)
                $assessmentDate = $baseDate->copy()->addDays(3);
                
                // Calculate assessment score based on user answers
                $assessmentScore = $this->calculateAssessmentScore($application);
                
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $assessmentStatus->id,
                    'processed_at' => $assessmentDate,
                    'score' => $assessmentScore, // Score dari UserAnswer
                    'notes' => $this->getRandomAssessmentNotes(),
                    'scheduled_at' => $assessmentDate->copy()->addDays(1),
                    'completed_at' => $assessmentDate->copy()->addDays(2),
                    'reviewed_by' => $reviewer->id,
                    'reviewed_at' => $assessmentDate->copy()->addDays(3),
                    'is_active' => false,
                ]);

                // 3. History interview (current stage - belum dinilai)  
                $interviewDate = $baseDate->copy()->addDays(7);
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $interviewStatus->id,
                    'processed_at' => $interviewDate,
                    'score' => null, // Belum di-interview
                    'notes' => 'Zoom URL: https://zoom.us/j/example123456',
                    'scheduled_at' => $interviewDate->copy()->addDays(2),
                    'completed_at' => null,
                    'reviewed_by' => null,
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
            "Technical interview completed - demonstrated strong problem-solving skills.",
            "HR interview completed - excellent communication and cultural fit.",
            "Final interview completed - shows great leadership potential.",
            "All interviews completed successfully - recommended for hiring.",
            "Technical and HR interviews completed - strong candidate overall.",
        ];
        return $notes[array_rand($notes)];
    }

    /**
     * Calculate assessment score based on user answers
     */
    private function calculateAssessmentScore(Application $application): float
    {
        $userAnswers = \App\Models\UserAnswer::where('user_id', $application->user_id)
            ->with('choice')
            ->get();

        if ($userAnswers->isEmpty()) {
            return 0.0;
        }

        $correctAnswers = $userAnswers->filter(function($answer) {
            return $answer->choice && $answer->choice->is_correct;
        })->count();

        $totalAnswers = $userAnswers->count();
        
        return round(($correctAnswers / $totalAnswers) * 100, 2);
    }
} 