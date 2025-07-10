<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\ApplicationReport;
use Illuminate\Database\Seeder;

class ApplicationReportSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Creating application reports...');

        // Get all applications
        $applications = Application::with(['history.status'])->get();

        $reportsCreated = 0;

        foreach ($applications as $application) {
            // Get scores from each stage
            $administrationScore = $application->history
                ->first(function($history) {
                    return $history->status->code === 'admin_selection' && 
                           $history->is_active &&
                           $history->score !== null;
                })?->score;

            $assessmentScore = $application->history
                ->first(function($history) {
                    return $history->status->code === 'psychotest' && 
                           $history->is_active &&
                           $history->score !== null;
                })?->score;

            $interviewScore = $application->history
                ->first(function($history) {
                    return $history->status->code === 'interview' && 
                           $history->is_active &&
                           $history->score !== null &&
                           $history->completed_at !== null;
                })?->score;

            // Only create report if all scores exist
            if ($administrationScore && $assessmentScore && $interviewScore) {
                $overallScore = ($administrationScore + $assessmentScore + $interviewScore) / 3;

                ApplicationReport::create([
                    'application_id' => $application->id,
                    'overall_score' => $overallScore,
                    'final_notes' => "Candidate has completed all stages with scores:\n" .
                                   "- Administration: " . number_format($administrationScore, 2) . "\n" .
                                   "- Assessment: " . number_format($assessmentScore, 2) . "\n" .
                                   "- Interview: " . number_format($interviewScore, 2) . "\n" .
                                   "Average Score: " . number_format($overallScore, 2),
                    'final_decision' => 'pending',
                ]);

                $reportsCreated++;
            }
        }

        $this->command->info("Created {$reportsCreated} application reports for candidates with complete scores.");
    }
} 