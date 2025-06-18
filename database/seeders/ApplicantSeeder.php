<?php

namespace Database\Seeders;

use App\Enums\CandidatesStage;
use App\Models\Applicant;
use App\Models\ApplicantStageHistory;
use App\Models\Status;
use App\Models\User;
use App\Models\VacancyPeriods;
use Illuminate\Database\Seeder;

class ApplicantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'candidate')->get();
        $vacancyPeriods = VacancyPeriods::all();
        $statuses = Status::all();
        $admins = User::whereIn('role', ['super_admin', 'hr', 'head_hr'])->get();

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

        if ($admins->isEmpty()) {
            $this->command->error('No admin users found. Please run SuperAdminSeeder first.');
            return;
        }

        // Create realistic applications
        foreach ($users as $user) {
            // Each user applies to 1-3 random vacancy periods
            $applicationCount = min(rand(1, 3), $vacancyPeriods->count());
            $selectedVacancyPeriods = $vacancyPeriods->random($applicationCount);

            foreach ($selectedVacancyPeriods as $vacancyPeriod) {
                $appliedAt = fake()->dateTimeBetween('-3 months', 'now');
                
                // Distribute stages realistically
                $stageDistribution = rand(1, 100);
                
                if ($stageDistribution <= 35) {
                    // 35% - Still in administrative review
                    $currentStage = CandidatesStage::ADMINISTRATIVE_SELECTION;
                    $adminScore = rand(60, 85);
                } elseif ($stageDistribution <= 55) {
                    // 20% - Moved to psychotest
                    $currentStage = CandidatesStage::PSYCHOTEST;
                    $adminScore = rand(75, 95);
                    $testScore = rand(65, 90);
                } elseif ($stageDistribution <= 70) {
                    // 15% - Moved to interview
                    $currentStage = CandidatesStage::INTERVIEW;
                    $adminScore = rand(80, 95);
                    $testScore = rand(70, 95);
                    $interviewScore = rand(70, 90);
                } elseif ($stageDistribution <= 80) {
                    // 10% - Accepted
                    $currentStage = CandidatesStage::ACCEPTED;
                    $adminScore = rand(85, 100);
                    $testScore = rand(80, 100);
                    $interviewScore = rand(85, 100);
                } else {
                    // 20% - Rejected at various stages
                    $rejectionStage = rand(1, 3);
                    if ($rejectionStage == 1) {
                        $currentStage = CandidatesStage::REJECTED;
                        $adminScore = rand(30, 65);
                    } elseif ($rejectionStage == 2) {
                        $currentStage = CandidatesStage::REJECTED;
                        $adminScore = rand(70, 80);
                        $testScore = rand(30, 60);
                    } else {
                        $currentStage = CandidatesStage::REJECTED;
                        $adminScore = rand(75, 85);
                        $testScore = rand(70, 85);
                        $interviewScore = rand(30, 65);
                    }
                }

                $applicant = Applicant::create([
                    'user_id' => $user->id,
                    'vacancy_period_id' => $vacancyPeriod->id,
                    'status_id' => $statuses->random()->id,
                    'current_stage' => $currentStage,
                    'applied_at' => $appliedAt,
                    
                    // Admin stage
                    'admin_score' => $adminScore ?? null,
                    'admin_notes' => isset($adminScore) ? $this->getAdminNotes($adminScore) : null,
                    'admin_reviewed_at' => isset($adminScore) ? fake()->dateTimeBetween($appliedAt, 'now') : null,
                    'admin_reviewed_by' => isset($adminScore) ? $admins->random()->id : null,
                    
                    // Test stage
                    'test_score' => $testScore ?? null,
                    'test_notes' => isset($testScore) ? $this->getTestNotes($testScore) : null,
                    'test_scheduled_at' => isset($testScore) ? fake()->dateTimeBetween($appliedAt, 'now') : null,
                    'test_completed_at' => isset($testScore) ? fake()->dateTimeBetween($appliedAt, 'now') : null,
                    
                    // Interview stage
                    'interview_score' => $interviewScore ?? null,
                    'interview_notes' => isset($interviewScore) ? $this->getInterviewNotes($interviewScore) : null,
                    'interview_scheduled_at' => isset($interviewScore) ? fake()->dateTimeBetween($appliedAt, 'now') : null,
                    'interview_completed_at' => isset($interviewScore) ? fake()->dateTimeBetween($appliedAt, 'now') : null,
                    'interviewer_id' => isset($interviewScore) ? $admins->random()->id : null,
                    
                    // Final decision
                    'rejection_reason' => $currentStage === CandidatesStage::REJECTED ? 
                        fake()->randomElement([
                            'Tidak memenuhi kualifikasi minimum',
                            'Skor psikotes di bawah standar',
                            'Kurang pengalaman yang relevan',
                            'Tidak cocok dengan budaya perusahaan'
                        ]) : null,
                    'decision_made_at' => in_array($currentStage, [CandidatesStage::ACCEPTED, CandidatesStage::REJECTED]) ?
                        fake()->dateTimeBetween($appliedAt, 'now') : null,
                    'decision_made_by' => in_array($currentStage, [CandidatesStage::ACCEPTED, CandidatesStage::REJECTED]) ?
                        $admins->random()->id : null,
                ]);

                // Create stage progression history
                $this->createStageHistory($applicant, $admins);
            }
        }

        $this->command->info('Created ' . Applicant::count() . ' realistic applications');
    }

    private function createStageHistory(Applicant $applicant, $admins)
    {
        if ($admins->isEmpty()) {
            return; // Skip if no admins available
        }

        $stages = [
            CandidatesStage::ADMINISTRATIVE_SELECTION,
            CandidatesStage::PSYCHOTEST,
            CandidatesStage::INTERVIEW,
            $applicant->current_stage === CandidatesStage::ACCEPTED ? CandidatesStage::ACCEPTED : null,
            $applicant->current_stage === CandidatesStage::REJECTED ? CandidatesStage::REJECTED : null,
        ];

        $previousStage = CandidatesStage::ADMINISTRATIVE_SELECTION;
        $changeDate = $applicant->applied_at;

        foreach ($stages as $stage) {
            if (!$stage || $stage === CandidatesStage::ADMINISTRATIVE_SELECTION) continue;
            
            // Only create history if applicant has reached this stage
            if ($this->hasReachedStage($applicant, $stage)) {
                ApplicantStageHistory::create([
                    'applicant_id' => $applicant->id,
                    'from_stage' => $previousStage,
                    'to_stage' => $stage,
                    'notes' => fake()->optional(0.3)->randomElement([
                        'Kandidat berhasil memenuhi syarat untuk tahap selanjutnya',
                        'Proses evaluasi selesai, melanjutkan ke tahap berikutnya',
                        'Hasil review positif, approved untuk tahap selanjutnya',
                        'Memenuhi kriteria minimum untuk melanjutkan proses',
                        'Setelah evaluasi, diputuskan untuk lanjut ke tahap berikutnya'
                    ]),
                    'changed_by' => $admins->random()->id,
                    'changed_at' => $changeDate = fake()->dateTimeBetween($changeDate, 'now'),
                ]);
                
                $previousStage = $stage;
                
                // If this is the current stage, break
                if ($stage === $applicant->current_stage) break;
            }
        }
    }

    private function hasReachedStage(Applicant $applicant, CandidatesStage $stage): bool
    {
        $stageOrder = [
            CandidatesStage::ADMINISTRATIVE_SELECTION->value => 1,
            CandidatesStage::PSYCHOTEST->value => 2,
            CandidatesStage::INTERVIEW->value => 3,
            CandidatesStage::ACCEPTED->value => 4,
            CandidatesStage::REJECTED->value => 4, // Can happen at any stage
        ];

        $currentOrder = $stageOrder[$applicant->current_stage->value] ?? 0;
        $targetOrder = $stageOrder[$stage->value] ?? 0;

        return $currentOrder >= $targetOrder;
    }

    private function getAdminNotes($score)
    {
        if ($score >= 85) {
            return fake()->randomElement([
                'Dokumen lengkap dan sesuai persyaratan. Latar belakang pendidikan sangat relevan.',
                'Kualifikasi sangat baik. Pengalaman kerja sesuai dengan posisi yang dilamar.',
                'CV terstruktur dengan baik. Pengalaman dan skill sangat menarik.',
                'Background akademik excellent. Pengalaman organisasi juga menunjang.',
                'Profil kandidat sangat sesuai dengan job requirement. Recommended untuk tahap selanjutnya.'
            ]);
        } elseif ($score >= 75) {
            return fake()->randomElement([
                'Kualifikasi cukup baik. Beberapa pengalaman relevan dengan posisi.',
                'Dokumen lengkap. Perlu explorasi lebih lanjut mengenai technical skills.',
                'Background pendidikan sesuai. Pengalaman kerja masih terbatas.',
                'Profil menarik namun perlu dikonfirmasi lebih detail saat interview.',
                'Memenuhi basic requirement. Potential untuk berkembang.'
            ]);
        } elseif ($score >= 65) {
            return fake()->randomElement([
                'Kualifikasi cukup namun pengalaman masih kurang untuk posisi ini.',
                'Dokumen kurang lengkap. Perlu dilengkapi beberapa persyaratan.',
                'Background akademik OK tapi pengalaman tidak terlalu relevan.',
                'Skill set basic sudah ada, namun perlu training lebih lanjut.',
                'Potential ada, namun masih perlu development yang cukup signifikan.'
            ]);
        } else {
            return fake()->randomElement([
                'Kualifikasi tidak memenuhi minimum requirement untuk posisi ini.',
                'Dokumen tidak lengkap dan pengalaman tidak relevan.',
                'Background pendidikan tidak sesuai dengan job specification.',
                'Gap yang cukup besar antara requirement dan profile kandidat.',
                'Tidak recommended untuk melanjutkan ke tahap selanjutnya.'
            ]);
        }
    }

    private function getTestNotes($score)
    {
        if ($score >= 85) {
            return fake()->randomElement([
                'Hasil psikotes sangat baik. Skor IQ dan kepribadian sesuai dengan posisi.',
                'Kemampuan logika dan analisis excellent. Personality type cocok dengan team.',
                'Test results menunjukkan kandidat memiliki potensi leadership yang baik.',
                'Skor verbal dan numerical di atas rata-rata. Critical thinking skills bagus.',
                'Overall test performance sangat memuaskan. Recommended untuk interview.'
            ]);
        } elseif ($score >= 75) {
            return fake()->randomElement([
                'Hasil psikotes cukup baik. Beberapa area masih perlu improvement.',
                'Skor IQ dalam range normal. Personality assessment menunjukkan hasil positif.',
                'Kemampuan problem solving cukup baik namun masih bisa ditingkatkan.',
                'Test results acceptable. Cocok untuk posisi entry to mid level.',
                'Performance test rata-rata namun masih dalam batas minimum.'
            ]);
        } elseif ($score >= 65) {
            return fake()->randomElement([
                'Hasil psikotes di bawah ekspektasi. Beberapa area concern.',
                'Skor IQ marginal. Personality type kurang cocok dengan budaya kerja.',
                'Kemampuan analisis masih lemah. Perlu training intensive jika diterima.',
                'Test results menunjukkan potential namun masih perlu banyak development.',
                'Borderline performance. Perlu pertimbangan lebih lanjut.'
            ]);
        } else {
            return fake()->randomElement([
                'Hasil psikotes tidak memenuhi standar minimum perusahaan.',
                'Skor IQ dan personality assessment di bawah cut-off point.',
                'Kemampuan kognitif dan analisis sangat lemah.',
                'Test performance sangat mengecewakan. Tidak cocok untuk posisi ini.',
                'Overall test results tidak memuaskan. Not recommended.'
            ]);
        }
    }

    private function getInterviewNotes($score)
    {
        if ($score >= 85) {
            return fake()->randomElement([
                'Interview sangat baik. Komunikasi excellent dan jawaban sangat memuaskan.',
                'Kandidat menunjukkan technical competency yang sangat baik. Cultural fit excellent.',
                'Sangat confident dan artikulatif. Problem solving skills sangat impresif.',
                'Personality sangat cocok dengan team. Leadership potential terlihat jelas.',
                'Overall interview performance outstanding. Strongly recommended untuk hire.'
            ]);
        } elseif ($score >= 75) {
            return fake()->randomElement([
                'Interview cukup baik. Komunikasi lancar namun beberapa jawaban masih shallow.',
                'Technical knowledge adequate. Personality fit dengan team kultur.',
                'Cukup confident dalam menjawab pertanyaan. Problem solving skills OK.',
                'Menunjukkan enthusiasm yang baik. Beberapa area masih perlu improvement.',
                'Good interview performance. Recommended dengan beberapa catatan.'
            ]);
        } elseif ($score >= 65) {
            return fake()->randomElement([
                'Interview performance di bawah ekspektasi. Komunikasi kurang smooth.',
                'Technical knowledge terbatas. Beberapa jawaban tidak memuaskan.',
                'Kurang confident dan nervous. Problem solving approach masih lemah.',
                'Cultural fit questionable. Perlu adaptasi yang cukup signifikan.',
                'Marginal interview performance. Perlu pertimbangan lebih lanjut.'
            ]);
        } else {
            return fake()->randomElement([
                'Interview performance sangat mengecewakan. Komunikasi sangat lemah.',
                'Technical competency sangat kurang. Tidak bisa menjawab pertanyaan dasar.',
                'Sangat nervous dan tidak confident. Personality tidak cocok dengan posisi.',
                'Problem solving skills sangat lemah. Cultural fit sangat buruk.',
                'Overall interview sangat tidak memuaskan. Not recommended untuk hire.'
            ]);
        }
    }
}
