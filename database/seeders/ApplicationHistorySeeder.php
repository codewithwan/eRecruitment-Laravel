<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\ApplicationHistory;
use App\Models\Status;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ApplicationHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $applications = Application::all();
        $statuses = Status::all()->keyBy('code');
        $hrUsers = User::where('role', 'hr')->get();

        foreach ($applications as $application) {
            // Create administration history
            if ($statuses->has('admin_selection')) {
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $statuses['admin_selection']->id,
                    'processed_at' => $application->created_at->addDays(rand(1, 3)),
                    'score' => rand(70, 95),
                    'notes' => $this->getAdministrationNotes(),
                    'reviewed_by' => $hrUsers->random()->id,
                    'reviewed_at' => $application->created_at->addDays(rand(1, 3)),
                    'is_active' => true,
                ]);
            }

            // Create psychotest history (if application passes administration)
            if ($statuses->has('psychotest') && rand(1, 100) > 15) { // 85% pass rate
                $scheduledAt = $application->created_at->addDays(rand(4, 7));
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $statuses['psychotest']->id,
                    'processed_at' => $scheduledAt->copy()->addDays(1),
                    'scheduled_at' => $scheduledAt,
                    'completed_at' => $scheduledAt->copy()->addDays(1),
                    'score' => rand(65, 90),
                    'notes' => $this->getPsychotestNotes(),
                    'reviewed_by' => $hrUsers->random()->id,
                    'reviewed_at' => $scheduledAt->copy()->addDays(1),
                    'is_active' => true,
                ]);
            }

            // Create interview history (if application passes psychotest)
            if ($statuses->has('interview') && rand(1, 100) > 25) { // 75% pass rate
                $scheduledAt = $application->created_at->addDays(rand(8, 12));
                ApplicationHistory::create([
                    'application_id' => $application->id,
                    'status_id' => $statuses['interview']->id,
                    'processed_at' => $scheduledAt->copy()->addDays(1),
                    'scheduled_at' => $scheduledAt,
                    'completed_at' => $scheduledAt->copy()->addDays(1),
                    'score' => rand(70, 95),
                    'notes' => $this->getInterviewNotes(),
                    'reviewed_by' => $hrUsers->random()->id,
                    'reviewed_at' => $scheduledAt->copy()->addDays(1),
                    'is_active' => true,
                ]);
            }
        }
    }

    private function getAdministrationNotes(): string
    {
        $notes = [
            'Dokumen lengkap dan sesuai persyaratan. Kandidat memenuhi kualifikasi minimum.',
            'Background pendidikan sesuai. Pengalaman kerja yang relevan.',
            'Skor IQ dalam range normal. Personality assessment menunjukkan kesesuaian.',
            'Kandidat tidak menunjukkan minat atau pengetahuan yang memadai.',
            'Setelah pertimbangan menyeluruh, perusahaan memilih kandidat lain.',
        ];

        return $notes[array_rand($notes)];
    }

    private function getPsychotestNotes(): string
    {
        $notes = [
            'Test results acceptable. Good for entry-level position.',
            'Kemampuan tidak menunjukkan minat atau pengetahuan.',
            'Candidate did not demonstrate sufficient interest or knowledge.',
            'Setelah pertimbangan menyeluruh, perusahaan memilih.',
            'Kualifikasi tidak memenuhi minimum requirement unit.',
        ];

        return $notes[array_rand($notes)];
    }

    private function getInterviewNotes(): string
    {
        $notes = [
            'Komunikasi baik dan menunjukkan antusiasme tinggi.',
            'Pengalaman teknis memadai untuk posisi yang dilamar.',
            'Kandidat menunjukkan potensi untuk berkembang.',
            'Kurang pengalaman dalam bidang yang diperlukan.',
            'Tidak menunjukkan komitmen jangka panjang.',
        ];

        return $notes[array_rand($notes)];
    }
} 