<?php

namespace Database\Seeders;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\ApplicationEvaluation;
use App\Models\ApplicationSchedule;
use App\Models\ApplicationStageHistory;

use App\Models\Status;
use App\Models\User;
use App\Models\VacancyPeriods;
use App\Models\QuestionPack;
use Illuminate\Database\Seeder;

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
        $stageRecords = Status::stages()->get();
        $questionPacks = QuestionPack::all();
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
        
        if ($stageRecords->isEmpty()) {
            $this->command->error('No stage records found. Please create some stage records first.');
            return;
        }
        
        if ($questionPacks->isEmpty()) {
            $this->command->error('No question packs found. Please run QuestionPackSeeder first.');
            return;
        }

        if ($admins->isEmpty()) {
            $this->command->error('No admin users found. Please run SuperAdminSeeder first.');
            return;
        }

        // Get status IDs for common statuses
        $pendingStatus = $statuses->where('code', 'pending')->first()->id;
        $acceptedStatus = $statuses->where('code', 'accepted')->first()->id; 
        $rejectedStatus = $statuses->where('code', 'rejected')->first()->id;
        
        // Get stage IDs
        $adminStageId = $stageRecords->where('code', 'administrative_selection')->first()->id;
        $psychotestStageId = $stageRecords->where('code', 'psychological_test')->first()->id;
        $interviewStageId = $stageRecords->where('code', 'interview')->first()->id;

        // Create realistic applications
        foreach ($users as $user) {
            // Each user applies to 1-3 random vacancy periods
            $applicationCount = min(rand(1, 3), $vacancyPeriods->count());
            $selectedVacancyPeriods = $vacancyPeriods->random($applicationCount);

            foreach ($selectedVacancyPeriods as $vacancyPeriod) {
                $appliedAt = fake()->dateTimeBetween('-3 months', 'now');
                
                // Distribute stages realistically
                $stageDistribution = rand(1, 100);
                $status_id = $pendingStatus;
                
                if ($stageDistribution <= 35) {
                    // 35% - Still in administrative review
                    $currentStage = ApplicationStatus::ADMINISTRATIVE_SELECTION;
                    $currentStageId = $adminStageId;
                    $adminScore = rand(60, 85);
                } elseif ($stageDistribution <= 55) {
                    // 20% - Moved to psychotest
                    $currentStage = ApplicationStatus::PSYCHOLOGICAL_TEST;
                    $currentStageId = $psychotestStageId;
                    $adminScore = rand(75, 95);
                    $testScore = rand(65, 90);
                } elseif ($stageDistribution <= 70) {
                    // 15% - Moved to interview
                    $currentStage = ApplicationStatus::INTERVIEW;
                    $currentStageId = $interviewStageId;
                    $adminScore = rand(80, 95);
                    $testScore = rand(70, 95);
                    $interviewScore = rand(70, 90);
                } elseif ($stageDistribution <= 80) {
                    // 10% - Accepted
                    $currentStage = ApplicationStatus::ACCEPTED;
                    $currentStageId = $interviewStageId; // Last stage is interview
                    $status_id = $acceptedStatus;
                    $adminScore = rand(85, 100);
                    $testScore = rand(80, 100);
                    $interviewScore = rand(85, 100);
                } else {
                    // 20% - Rejected at various stages
                    $rejectionStage = rand(1, 3);
                    $status_id = $rejectedStatus;
                    
                    if ($rejectionStage == 1) {
                        $currentStage = ApplicationStatus::REJECTED;
                        $currentStageId = $adminStageId;
                        $adminScore = rand(30, 65);
                    } elseif ($rejectionStage == 2) {
                        $currentStage = ApplicationStatus::REJECTED;
                        $currentStageId = $psychotestStageId;
                        $adminScore = rand(70, 80);
                        $testScore = rand(30, 60);
                    } else {
                        $currentStage = ApplicationStatus::REJECTED;
                        $currentStageId = $interviewStageId;
                        $adminScore = rand(75, 85);
                        $testScore = rand(70, 85);
                        $interviewScore = rand(30, 65);
                    }
                }

                // First create the application record
                $application = Application::create([
                    'user_id' => $user->id,
                    'vacancy_period_id' => $vacancyPeriod->id,
                    'current_stage' => $currentStage,
                    'current_stage_id' => $currentStageId,
                    'status_id' => $status_id,
                    'applied_at' => $appliedAt,
                ]);

                // Create evaluation records
                ApplicationEvaluation::create([
                    'application_id' => $application->id,
                    
                    // Admin stage
                    'admin_score' => $adminScore ?? null,
                    'admin_notes' => isset($adminScore) ? $this->getAdminNotes($adminScore) : null,
                    'admin_reviewed_at' => isset($adminScore) ? fake()->dateTimeBetween($appliedAt, 'now') : null,
                    'admin_reviewed_by' => isset($adminScore) ? $admins->random()->id : null,
                    
                    // Test stage
                    'test_score' => $testScore ?? null,
                    'test_notes' => isset($testScore) ? $this->getTestNotes($testScore) : null,
                    'test_completed_at' => isset($testScore) ? fake()->dateTimeBetween($appliedAt, 'now') : null,
                    
                    // Interview stage
                    'interview_score' => $interviewScore ?? null,
                    'interview_notes' => isset($interviewScore) ? $this->getInterviewNotes($interviewScore) : null,
                    'interview_completed_at' => isset($interviewScore) ? fake()->dateTimeBetween($appliedAt, 'now') : null,
                    'interviewer_id' => isset($interviewScore) ? $admins->random()->id : null,
                    
                    // Final decision
                    'rejection_reason' => $status_id === $rejectedStatus ? 
                        fake()->randomElement([
                            'Tidak memenuhi kualifikasi minimum',
                            'Skor psikotes di bawah standar',
                            'Kurang pengalaman yang relevan',
                            'Tidak cocok dengan budaya perusahaan'
                        ]) : null,
                    'decision_made_at' => in_array($status_id, [$acceptedStatus, $rejectedStatus]) ?
                        fake()->dateTimeBetween($appliedAt, 'now') : null,
                    'decision_made_by' => in_array($status_id, [$acceptedStatus, $rejectedStatus]) ?
                        $admins->random()->id : null,
                ]);
                
                // Create schedule records
                ApplicationSchedule::create([
                    'application_id' => $application->id,
                    
                    // Test scheduling
                    'test_scheduled_at' => isset($testScore) ? fake()->dateTimeBetween($appliedAt, '+2 weeks') : null,
                    'test_type' => isset($testScore) ? 
                        // Gunakan test_type dari question pack jika tersedia
                        ($questionPacks->isNotEmpty() ? $questionPacks->random()->test_type : 
                        fake()->randomElement(['general', 'technical', 'leadership'])) : null,
                    'test_scheduled_by' => isset($testScore) ? $admins->random()->id : null,
                    
                    // Interview scheduling
                    'interview_scheduled_at' => isset($interviewScore) ? fake()->dateTimeBetween($appliedAt, '+3 weeks') : null,
                    'is_interview_online' => isset($interviewScore) ? fake()->boolean(80) : true, // Default to true if no interview
                    'interview_location' => isset($interviewScore) ? 
                        fake()->randomElement(['Zoom Meeting', 'Google Meet', 'Microsoft Teams', 'Skype']) : null,
                    'company_id' => isset($interviewScore) && !fake()->boolean(80) ? $vacancyPeriod->vacancy->company_id : null,
                    'interview_scheduled_by' => isset($interviewScore) ? $admins->random()->id : null,
                    
                    // Status tracking
                    'test_attendance_confirmed' => isset($testScore),
                    'interview_attendance_confirmed' => isset($interviewScore),
                ]);

                // Create stage progression history
                $this->createStageHistory($application, $admins);
            }
        }

        $this->command->info('Created ' . Application::count() . ' realistic applications');
    }

    private function createStageHistory(Application $application, $admins)
    {
        if ($admins->isEmpty()) {
            return; // Skip if no admins available
        }

        $stages = [
            ApplicationStatus::ADMINISTRATIVE_SELECTION,
            ApplicationStatus::PSYCHOLOGICAL_TEST,
            ApplicationStatus::INTERVIEW,
        ];

        // Add final stage based on status
        if ($application->isAccepted()) {
            $stages[] = ApplicationStatus::ACCEPTED;
        } elseif ($application->isRejected()) {
            $stages[] = ApplicationStatus::REJECTED;
        }

        $previousStage = ApplicationStatus::ADMINISTRATIVE_SELECTION;
        $changeDate = $application->applied_at;

        foreach ($stages as $stage) {
            if (!$stage || $stage === ApplicationStatus::ADMINISTRATIVE_SELECTION) continue;
            
            // Only create history if application has reached this stage
            if ($this->hasReachedStage($application, $stage)) {
                ApplicationStageHistory::create([
                    'application_id' => $application->id,
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
                if ($stage === $application->current_stage) break;
            }
        }
    }

    private function hasReachedStage(Application $application, ApplicationStatus $stage): bool
    {
        $stageOrder = [
            ApplicationStatus::ADMINISTRATIVE_SELECTION->value => 1,
            ApplicationStatus::PSYCHOLOGICAL_TEST->value => 2,
            ApplicationStatus::INTERVIEW->value => 3,
            ApplicationStatus::ACCEPTED->value => 4,
            ApplicationStatus::REJECTED->value => 4, // Can happen at any stage
        ];

        $currentOrder = $stageOrder[$application->current_stage->value] ?? 0;
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
                'Hasil psikotes menunjukkan self-motivation dan adaptabilitas yang tinggi.'
            ]);
        } elseif ($score >= 75) {
            return fake()->randomElement([
                'Skor psikotes di atas rata-rata untuk beberapa aspek penting.',
                'Kemampuan analisis cukup baik. Personality traits sesuai harapan.',
                'Cognitive abilities memenuhi standard. Emotional intelligence baik.',
                'Hasil test menunjukkan potensi yang baik untuk dikembangkan.',
                'Skor verbal dan numerical cukup baik. Teamwork skills baik.'
            ]);
        } elseif ($score >= 60) {
            return fake()->randomElement([
                'Skor psikotes average. Beberapa area perlu improvement.',
                'Cognitive abilities memenuhi minimum requirement.',
                'Basic problem-solving skills ada, namun perlu dikembangkan.',
                'Personality traits cukup sesuai, namun ada beberapa concerns.',
                'Kemampuan komunikasi dan teamwork masih perlu ditingkatkan.'
            ]);
        } else {
            return fake()->randomElement([
                'Skor psikotes di bawah standar minimum untuk posisi ini.',
                'Cognitive abilities dan personality traits kurang sesuai dengan requirement.',
                'Problem-solving skills dan analytical thinking perlu perbaikan signifikan.',
                'Hasil test menunjukkan gap yang cukup besar dengan expectation.',
                'Tidak recommended untuk melanjutkan ke tahap selanjutnya.'
            ]);
        }
    }

    private function getInterviewNotes($score)
    {
        if ($score >= 85) {
            return fake()->randomElement([
                'Interview sangat memuaskan. Kandidat menunjukkan knowledge dan experience yang sangat relevan.',
                'Komunikasi excellent. Technical skills sesuai requirement. Attitude sangat positif.',
                'Respons terhadap situasional questions sangat baik. Problem-solving skills terlihat jelas.',
                'Memiliki clarity dalam career goals. Nilai-nilai pribadi align dengan perusahaan.',
                'Sangat recommended untuk posisi ini. Cultural fit sangat baik.'
            ]);
        } elseif ($score >= 75) {
            return fake()->randomElement([
                'Interview berjalan baik. Knowledge dan experience relevan dengan posisi.',
                'Komunikasi baik. Technical skills memenuhi requirement dasar.',
                'Menunjukkan kemampuan adaptasi dan problem-solving yang baik.',
                'Career goals cukup jelas. Ada potensi untuk growth dan development.',
                'Recommended untuk posisi ini dengan beberapa notes untuk improvement.'
            ]);
        } elseif ($score >= 60) {
            return fake()->randomElement([
                'Interview cukup. Ada beberapa area yang masih perlu dikonfirmasi lebih lanjut.',
                'Komunikasi cukup. Technical skills memenuhi minimum requirement.',
                'Respons terhadap situasional questions menunjukkan area untuk improvement.',
                'Career path masih perlu diklarifikasi. Alignment dengan perusahaan perlu dieksplorasi.',
                'Dapat dipertimbangkan dengan catatan perlu onboarding dan training yang intensif.'
            ]);
        } else {
            return fake()->randomElement([
                'Interview kurang memuaskan. Knowledge dan experience tidak sesuai requirement.',
                'Komunikasi kurang efektif. Technical skills di bawah standar minimum.',
                'Respons terhadap situasional questions tidak menunjukkan problem-solving skills yang diharapkan.',
                'Tidak ada clarity dalam career goals. Nilai-nilai tidak align dengan perusahaan.',
                'Tidak recommended untuk posisi ini.'
            ]);
        }
    }
} 