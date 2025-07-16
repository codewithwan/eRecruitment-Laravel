<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\ApplicationHistory;
use App\Models\ApplicationReport;
use App\Models\Status;
use App\Models\User;
use App\Models\VacancyPeriods;
use App\Models\UserAnswer;
use App\Models\Question;
use App\Models\Choice;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApplicationSeeder extends Seeder
{
    private $adminUsers;
    private $statuses;

    public function run(): void
    {
        $this->command->info('🚀 Creating comprehensive test applications...');

        // Clear existing data for clean testing
        $this->clearExistingData();

        // Get required data
        $vacancyPeriods = VacancyPeriods::with(['vacancy.questionPack.questions.choices', 'period'])->get();
        $candidates = User::where('role', 'candidate')->get();
        $this->adminUsers = User::whereIn('role', ['hr', 'head_hr', 'head_dev'])->get();
        
        if ($vacancyPeriods->isEmpty() || $candidates->isEmpty() || $this->adminUsers->isEmpty()) {
            $this->command->error('Missing required data. Please run other seeders first.');
            return;
        }

        // Get statuses
        $this->statuses = [
            'admin_selection' => Status::where('code', 'admin_selection')->first(),
            'psychotest' => Status::where('code', 'psychotest')->first(),
            'interview' => Status::where('code', 'interview')->first(),
            'accepted' => Status::where('code', 'accepted')->first(),
            'rejected' => Status::where('code', 'rejected')->first(),
        ];

        if (in_array(null, $this->statuses)) {
            $this->command->error('Required statuses not found. Please run StatusSeeder first.');
            return;
        }

        // Use first vacancy period for all test scenarios
        $vacancyPeriod = $vacancyPeriods->first();
        $baseDate = Carbon::parse($vacancyPeriod->period->start_time);

        // Create different test scenarios
        $scenarios = [
            'administration_pending' => 2,    // Baru apply, belum direview
            'assessment_no_answers' => 2,     // Lolos admin, belum mengerjakan soal
            'assessment_with_answers' => 3,   // Lolos admin, sudah mengerjakan soal
            'interview_pending' => 2,         // Di tahap interview, belum di-interview
            'reports_pending' => 2,           // Punya 3 nilai, masuk reports (pending)
            'reports_accepted' => 1,          // Final decision: accepted
            'reports_rejected' => 1,          // Final decision: rejected
        ];

        $candidateIndex = 0;
        foreach ($scenarios as $scenario => $count) {
            for ($i = 0; $i < $count; $i++) {
                if ($candidateIndex >= $candidates->count()) break;
                
                $candidate = $candidates[$candidateIndex++];
                $this->createApplicationScenario($scenario, $candidate, $vacancyPeriod, $baseDate);
                
                $this->command->info("✅ Created: {$scenario} - {$candidate->name}");
            }
        }

        $this->command->info('🎉 Application seeding completed with comprehensive test scenarios!');
        $this->printTestingSummary();
    }

    private function clearExistingData(): void
    {
        $this->command->info('🧹 Clearing existing test data...');
        
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        ApplicationReport::truncate();
        ApplicationHistory::truncate();
        UserAnswer::truncate();
        Application::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    private function createApplicationScenario(string $scenario, User $candidate, $vacancyPeriod, Carbon $baseDate): void
    {
        $applicationDate = $baseDate->copy()->addDays(rand(1, 5));
        
        switch ($scenario) {
            case 'administration_pending':
                $this->createAdministrationPending($candidate, $vacancyPeriod, $applicationDate);
                break;
                
            case 'assessment_no_answers':
                $this->createAssessmentNoAnswers($candidate, $vacancyPeriod, $applicationDate);
                break;
                
            case 'assessment_with_answers':
                $this->createAssessmentWithAnswers($candidate, $vacancyPeriod, $applicationDate);
                break;
                
            case 'interview_pending':
                $this->createInterviewPending($candidate, $vacancyPeriod, $applicationDate);
                break;
                
            case 'reports_pending':
                $this->createReportsPending($candidate, $vacancyPeriod, $applicationDate);
                break;
                
            case 'reports_accepted':
                $this->createReportsAccepted($candidate, $vacancyPeriod, $applicationDate);
                break;
                
            case 'reports_rejected':
                $this->createReportsRejected($candidate, $vacancyPeriod, $applicationDate);
                break;
        }
    }

    private function createAdministrationPending(User $candidate, $vacancyPeriod, Carbon $date): void
    {
        // Baru apply, belum direview admin
        $application = Application::create([
            'user_id' => $candidate->id,
            'vacancy_period_id' => $vacancyPeriod->id,
            'status_id' => $this->statuses['admin_selection']->id,
            'created_at' => $date,
            'updated_at' => $date,
        ]);

        // History: masuk admin selection, belum direview
        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['admin_selection']->id,
            'processed_at' => $date,
            'score' => null,
            'notes' => null,
            'is_active' => true,
        ]);
    }

    private function createAssessmentNoAnswers(User $candidate, $vacancyPeriod, Carbon $date): void
    {
        // Lolos admin, masuk assessment tapi belum mengerjakan soal
        $application = Application::create([
            'user_id' => $candidate->id,
            'vacancy_period_id' => $vacancyPeriod->id,
            'status_id' => $this->statuses['psychotest']->id,
            'created_at' => $date,
            'updated_at' => $date->copy()->addDays(3),
        ]);

        $reviewer = $this->adminUsers->random();

        // History: admin selection completed
        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['admin_selection']->id,
            'processed_at' => $date,
            'score' => rand(80, 95),
            'notes' => 'Documents verified. Good candidate.',
            'completed_at' => $date->copy()->addDays(2),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(2),
            'is_active' => false,
        ]);

        // History: assessment current (belum mengerjakan)
        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['psychotest']->id,
            'processed_at' => $date->copy()->addDays(3),
            'score' => null,
            'notes' => null,
            'is_active' => true,
        ]);
    }

    private function createAssessmentWithAnswers(User $candidate, $vacancyPeriod, Carbon $date): void
    {
        // Lolos admin, di assessment dan sudah mengerjakan soal
        $application = Application::create([
            'user_id' => $candidate->id,
            'vacancy_period_id' => $vacancyPeriod->id,
            'status_id' => $this->statuses['psychotest']->id,
            'created_at' => $date,
            'updated_at' => $date->copy()->addDays(4),
        ]);

        $reviewer = $this->adminUsers->random();

        // History: admin selection completed
        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['admin_selection']->id,
            'processed_at' => $date,
            'score' => rand(75, 90),
            'notes' => 'Strong background. Recommended.',
            'completed_at' => $date->copy()->addDays(2),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(2),
            'is_active' => false,
        ]);

        // Create user answers for assessment
        $score = $this->createUserAnswers($candidate, $vacancyPeriod);

        // History: assessment with score
        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['psychotest']->id,
            'processed_at' => $date->copy()->addDays(3),
            'score' => $score,
            'notes' => "Assessment completed with score: {$score}%",
            'completed_at' => $date->copy()->addDays(4),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(4),
            'is_active' => true,
        ]);
    }

    private function createInterviewPending(User $candidate, $vacancyPeriod, Carbon $date): void
    {
        // Di tahap interview, belum di-interview
        $application = Application::create([
            'user_id' => $candidate->id,
            'vacancy_period_id' => $vacancyPeriod->id,
            'status_id' => $this->statuses['interview']->id,
            'created_at' => $date,
            'updated_at' => $date->copy()->addDays(6),
        ]);

        $reviewer = $this->adminUsers->random();

        // History: admin selection completed
        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['admin_selection']->id,
            'processed_at' => $date,
            'score' => rand(78, 88),
            'notes' => 'Excellent documentation.',
            'completed_at' => $date->copy()->addDays(2),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(2),
            'is_active' => false,
        ]);

        // Create assessment answers and history
        $assessmentScore = $this->createUserAnswers($candidate, $vacancyPeriod);
        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['psychotest']->id,
            'processed_at' => $date->copy()->addDays(3),
            'score' => $assessmentScore,
            'notes' => "Assessment score: {$assessmentScore}%",
            'completed_at' => $date->copy()->addDays(4),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(4),
            'is_active' => false,
        ]);

        // History: interview pending
        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['interview']->id,
            'processed_at' => $date->copy()->addDays(5),
            'score' => null,
            'notes' => null,
            'scheduled_at' => $date->copy()->addDays(7),
            'resource_url' => 'https://zoom.us/j/example' . rand(100000, 999999),
            'is_active' => true,
        ]);
    }

    private function createReportsPending(User $candidate, $vacancyPeriod, Carbon $date): void
    {
        // Sudah punya 3 nilai, masuk reports dengan status pending
        $application = Application::create([
            'user_id' => $candidate->id,
            'vacancy_period_id' => $vacancyPeriod->id,
            'status_id' => $this->statuses['interview']->id,
            'created_at' => $date,
            'updated_at' => $date->copy()->addDays(10),
        ]);

        $reviewer = $this->adminUsers->random();
        $adminScore = rand(75, 90);
        $assessmentScore = $this->createUserAnswers($candidate, $vacancyPeriod);
        $interviewScore = rand(70, 95);
        $overallScore = round(($adminScore + $assessmentScore + $interviewScore) / 3, 2);

        // All histories completed with scores
        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['admin_selection']->id,
            'processed_at' => $date,
            'score' => $adminScore,
            'notes' => 'Strong candidate profile.',
            'completed_at' => $date->copy()->addDays(2),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(2),
            'is_active' => false,
        ]);

        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['psychotest']->id,
            'processed_at' => $date->copy()->addDays(3),
            'score' => $assessmentScore,
            'notes' => "Assessment completed: {$assessmentScore}%",
            'completed_at' => $date->copy()->addDays(5),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(5),
            'is_active' => false,
        ]);

        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['interview']->id,
            'processed_at' => $date->copy()->addDays(7),
            'score' => $interviewScore,
            'notes' => 'Interview completed successfully.',
            'scheduled_at' => $date->copy()->addDays(8),
            'completed_at' => $date->copy()->addDays(9),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(9),
            'resource_url' => 'https://zoom.us/j/interview' . rand(100000, 999999),
            'is_active' => false,
        ]);

        // Create application report (pending)
        ApplicationReport::create([
            'application_id' => $application->id,
            'overall_score' => $overallScore,
            'final_decision' => 'pending',
            'final_notes' => "Overall score: {$overallScore}%. Ready for final decision.",
        ]);
    }

    private function createReportsAccepted(User $candidate, $vacancyPeriod, Carbon $date): void
    {
        $application = $this->createCompleteApplication($candidate, $vacancyPeriod, $date, 'accepted');
        
        // Update to accepted status
        $application->update(['status_id' => $this->statuses['accepted']->id]);
    }

    private function createReportsRejected(User $candidate, $vacancyPeriod, Carbon $date): void
    {
        $application = $this->createCompleteApplication($candidate, $vacancyPeriod, $date, 'rejected');
        
        // Update to rejected status  
        $application->update(['status_id' => $this->statuses['rejected']->id]);
    }

    private function createCompleteApplication(User $candidate, $vacancyPeriod, Carbon $date, string $decision): Application
    {
        $application = Application::create([
            'user_id' => $candidate->id,
            'vacancy_period_id' => $vacancyPeriod->id,
            'status_id' => $this->statuses['interview']->id,
            'created_at' => $date,
            'updated_at' => $date->copy()->addDays(12),
        ]);

        $reviewer = $this->adminUsers->random();
        $decisionMaker = $this->adminUsers->random();
        
        $adminScore = rand(75, 90);
        $assessmentScore = $this->createUserAnswers($candidate, $vacancyPeriod);
        $interviewScore = rand(70, 95);
        $overallScore = round(($adminScore + $assessmentScore + $interviewScore) / 3, 2);

        // Complete history
        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['admin_selection']->id,
            'processed_at' => $date,
            'score' => $adminScore,
            'notes' => 'Excellent candidate.',
            'completed_at' => $date->copy()->addDays(2),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(2),
            'is_active' => false,
        ]);

        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['psychotest']->id,
            'processed_at' => $date->copy()->addDays(3),
            'score' => $assessmentScore,
            'notes' => "Assessment: {$assessmentScore}%",
            'completed_at' => $date->copy()->addDays(5),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(5),
            'is_active' => false,
        ]);

        ApplicationHistory::create([
            'application_id' => $application->id,
            'status_id' => $this->statuses['interview']->id,
            'processed_at' => $date->copy()->addDays(7),
            'score' => $interviewScore,
            'notes' => 'Final interview completed.',
            'scheduled_at' => $date->copy()->addDays(8),
            'completed_at' => $date->copy()->addDays(9),
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => $date->copy()->addDays(9),
            'resource_url' => 'https://zoom.us/j/final' . rand(100000, 999999),
            'is_active' => false,
        ]);

        // Create application report with final decision
        ApplicationReport::create([
            'application_id' => $application->id,
            'overall_score' => $overallScore,
            'final_decision' => $decision,
            'final_notes' => $decision === 'accepted' 
                ? "Congratulations! Overall score: {$overallScore}%. Welcome to the team!"
                : "Thank you for your interest. Overall score: {$overallScore}%. We've decided to move forward with other candidates.",
            'decision_made_by' => $decisionMaker->id,
            'decision_made_at' => $date->copy()->addDays(11),
        ]);

        return $application;
    }

    private function createUserAnswers(User $candidate, $vacancyPeriod): float
    {
        $questions = $vacancyPeriod->vacancy->questionPack->questions ?? collect();
        
        if ($questions->isEmpty()) {
            return 0.0;
        }

        // Take up to 10 questions for testing
        $selectedQuestions = $questions->take(10);
        $correctAnswers = 0;
        $totalAnswers = $selectedQuestions->count();

        // Create answers with varying success rates
        $successRate = rand(60, 90) / 100; // 60-90% success rate

        foreach ($selectedQuestions as $question) {
            $choices = $question->choices;
            if ($choices->isEmpty()) continue;

            // Determine if this answer should be correct
            $shouldBeCorrect = rand(1, 100) <= ($successRate * 100);
            
            if ($shouldBeCorrect) {
                $correctChoice = $choices->where('is_correct', true)->first();
                $selectedChoice = $correctChoice ?: $choices->random();
                if ($correctChoice) $correctAnswers++;
            } else {
                $wrongChoices = $choices->where('is_correct', false);
                $selectedChoice = $wrongChoices->isNotEmpty() ? $wrongChoices->random() : $choices->random();
            }

            UserAnswer::create([
                'user_id' => $candidate->id,
                'question_id' => $question->id,
                'choice_id' => $selectedChoice->id,
            ]);
        }

        return $totalAnswers > 0 ? round(($correctAnswers / $totalAnswers) * 100, 2) : 0.0;
    }

    private function printTestingSummary(): void
    {
        $this->command->info('');
        $this->command->info('📊 TESTING SCENARIOS CREATED:');
        $this->command->info('');
        $this->command->info('🔸 Administration Pending (2): Baru apply, belum direview admin');
        $this->command->info('🔸 Assessment No Answers (2): Lolos admin, belum mengerjakan soal');
        $this->command->info('🔸 Assessment With Answers (3): Lolos admin, sudah mengerjakan soal');
        $this->command->info('🔸 Interview Pending (2): Di tahap interview, belum di-interview');
        $this->command->info('🔸 Reports Pending (2): Punya 3 nilai, masuk reports (pending)');
        $this->command->info('🔸 Reports Accepted (1): Final decision accepted');
        $this->command->info('🔸 Reports Rejected (1): Final decision rejected');
        $this->command->info('');
        $this->command->info('🚀 Ready for comprehensive testing!');
        $this->command->info('   Visit: /dashboard/recruitment/administration');
        $this->command->info('   Visit: /dashboard/recruitment/assessment'); 
        $this->command->info('   Visit: /dashboard/recruitment/interview');
        $this->command->info('   Visit: /dashboard/recruitment/reports');
    }
} 