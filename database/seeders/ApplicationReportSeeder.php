<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\ApplicationReport;
use App\Models\User;
use Illuminate\Database\Seeder;

class ApplicationReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $applications = Application::with(['history', 'user'])->get();
        $hrUsers = User::whereIn('role', ['hr', 'super_admin', 'head_hr'])->get();

        foreach ($applications as $application) {
            $historyScores = $application->history->pluck('score')->filter()->toArray();
            $overallScore = !empty($historyScores) ? round(array_sum($historyScores) / count($historyScores), 2) : null;

            // Pilih final_decision dari status aplikasi
            $finalDecision = match ($application->status->code) {
                'accepted' => 'accepted',
                'rejected' => 'rejected',
                default => 'pending',
            };

            ApplicationReport::create([
                'application_id'   => $application->id,
                'overall_score'    => $overallScore,
                'final_notes'      => $this->getFinalNotes($finalDecision),
                'final_decision'   => $finalDecision,
                'decision_made_by' => $hrUsers->random()->id,
                'decision_made_at' => now()->subDays(rand(1, 30)),
            ]);
        }
    }

    private function getFinalNotes($decision): string
    {
        return match ($decision) {
            'accepted' => 'Kandidat diterima berdasarkan hasil seleksi dan evaluasi.',
            'rejected' => 'Kandidat tidak memenuhi kriteria pada tahap seleksi.',
            default    => 'Aplikasi masih dalam proses evaluasi.',
        };
    }
} 