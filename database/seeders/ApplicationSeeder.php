<?php

namespace Database\Seeders;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\ApplicationAdministration;
use App\Models\ApplicationAssessment;
use App\Models\ApplicationInterview;
use App\Models\ApplicationReport;
use App\Models\Status;
use App\Models\User;
use App\Models\VacancyPeriods;
use App\Models\QuestionPack;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ApplicationSeeder extends Seeder
{
    // Define passing scores for each stage
    private const ADMIN_PASSING_SCORE = 70;
    private const ASSESSMENT_PASSING_SCORE = 65;
    private const INTERVIEW_PASSING_SCORE = 70;
    
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

        $totalApplications = 0;
        $adminCount = 0;
        $assessmentCount = 0;
        $interviewCount = 0;
        $reportCount = 0;

        // Create realistic applications
        foreach ($users as $user) {
            // Each user applies to 1-3 random vacancy periods
            $applicationCount = min(rand(1, 3), $vacancyPeriods->count());
            $selectedVacancyPeriods = $vacancyPeriods->random($applicationCount);

            foreach ($selectedVacancyPeriods as $vacancyPeriod) {
                $totalApplications++;
                
                // Create the application
                $appliedAt = fake()->dateTimeBetween('-60 days', '-30 days');
                $currentDate = Carbon::instance($appliedAt);
                
                $application = Application::create([
                    'user_id' => $user->id,
                    'vacancy_period_id' => $vacancyPeriod->id,
                    'status_id' => $pendingStatus, // Start with pending
                    'current_stage_id' => $adminStageId,
                    'current_stage' => ApplicationStatus::ADMINISTRATIVE_SELECTION,
                    'applied_at' => $appliedAt,
                ]);

                // Process each stage sequentially with realistic pass/fail rates
                $this->processAdministrationStage($application, $currentDate, $admins, $rejectedStatus, $pendingStatus, $adminCount);
                
                // Only proceed if passed administration
                if ($application->administration && $application->administration->status === 'passed') {
                    $this->processAssessmentStage($application, $currentDate, $admins, $psychotestStageId, $rejectedStatus, $pendingStatus, $assessmentCount);
                    
                    // Only proceed if passed assessment
                    if ($application->assessment && $application->assessment->status === 'completed' && 
                        $application->assessment->score >= self::ASSESSMENT_PASSING_SCORE) {
                        $this->processInterviewStage($application, $currentDate, $admins, $interviewStageId, $rejectedStatus, $pendingStatus, $interviewCount);
                        
                        // Final decision based on interview results (if interviewed)
                        if ($application->interview) {
                            $this->makeFinalDecision($application, $currentDate, $admins, $acceptedStatus, $rejectedStatus, $pendingStatus);
                        }
                    }
                }
                
                // Always create a final report
                $this->createFinalReport($application, $currentDate, $admins, $reportCount);
            }
        }

        $this->command->info("Created {$totalApplications} applications");
        $this->command->info("Administration records: {$adminCount}");
        $this->command->info("Assessment records: {$assessmentCount}");
        $this->command->info("Interview records: {$interviewCount}");
        $this->command->info("Report records: {$reportCount}");
    }

    private function processAdministrationStage($application, &$currentDate, $admins, $rejectedStatus, $pendingStatus, &$adminCount): void
    {
        // 10% chance that administration is still in review (pending)
        if (fake()->boolean(10)) {
            // Create administration record but don't mark as complete yet
            ApplicationAdministration::create([
                'application_id' => $application->id,
                'score' => null,
                'notes' => 'Dokumen masih dalam proses review oleh tim administrasi.',
                'documents_checked' => $this->getDocumentsChecked(),
                'requirements_met' => [],
                'status' => 'pending',
                'reviewed_by' => $admins->random()->id,
                'reviewed_at' => null,
            ]);
            
            $adminCount++;
            
            // Keep application as pending in administration stage
            $application->update([
                'status_id' => $pendingStatus,
                'current_stage' => ApplicationStatus::ADMINISTRATIVE_SELECTION,
            ]);
            return;
        }
        
        $currentDate->addDays(rand(2, 7)); // Review delay
        
        $adminScore = $this->generateRealisticScore(50, 95);
        $adminPassed = $adminScore >= self::ADMIN_PASSING_SCORE;
        
        ApplicationAdministration::create([
            'application_id' => $application->id,
            'score' => $adminScore,
            'notes' => $this->getAdminNotes($adminScore),
            'documents_checked' => $this->getDocumentsChecked(),
            'requirements_met' => $this->getRequirementsMet($adminPassed),
            'status' => $adminPassed ? 'passed' : 'failed',
            'reviewed_by' => $admins->random()->id,
            'reviewed_at' => $currentDate,
        ]);
        
        $adminCount++;
        
        // If failed at administration, mark as rejected and stop processing
        if (!$adminPassed) {
            $application->update([
                'status_id' => $rejectedStatus,
                'current_stage' => ApplicationStatus::REJECTED,
            ]);
        }
    }

    private function processAssessmentStage($application, &$currentDate, $admins, $psychotestStageId, $rejectedStatus, $pendingStatus, &$assessmentCount): void
    {
        $currentDate->addDays(rand(3, 10)); // Scheduling delay
        
        // Update application to assessment stage
        $application->update([
            'current_stage' => ApplicationStatus::PSYCHOLOGICAL_TEST,
            'current_stage_id' => $psychotestStageId,
        ]);

        // 15% chance that assessment is scheduled but not completed yet
        if (fake()->boolean(15)) {
            $scheduledAt = (clone $currentDate)->addDays(rand(1, 14)); // Future schedule
            
            ApplicationAssessment::create([
                'application_id' => $application->id,
                'score' => null,
                'notes' => 'Tes psikologi telah dijadwalkan, menunggu kandidat untuk mengikuti tes.',
                'test_type' => fake()->randomElement(['general', 'technical', 'leadership']),
                'test_results' => null,
                'status' => 'scheduled',
                'scheduled_at' => $scheduledAt,
                'started_at' => null,
                'completed_at' => null,
                'scheduled_by' => $admins->random()->id,
                'attendance_confirmed' => false,
                'test_location' => fake()->randomElement(['Online', 'Kantor Pusat - Lab Computer', 'Kantor Cabang']),
            ]);

            $assessmentCount++;
            
            // Keep application as pending in assessment stage
            $application->update([
                'status_id' => $pendingStatus,
                'current_stage' => ApplicationStatus::PSYCHOLOGICAL_TEST,
            ]);
            return;
        }

        $assessmentScore = $this->generateRealisticScore(40, 90);
        $assessmentPassed = $assessmentScore >= self::ASSESSMENT_PASSING_SCORE;
        
        $scheduledAt = (clone $currentDate)->addDays(rand(1, 5));
        $completedAt = (clone $scheduledAt)->addHours(2);
        
        ApplicationAssessment::create([
            'application_id' => $application->id,
            'score' => $assessmentScore,
            'notes' => $this->getTestNotes($assessmentScore),
            'test_type' => fake()->randomElement(['general', 'technical', 'leadership']),
            'test_results' => $this->getTestResults($assessmentScore),
            'status' => 'completed',
            'scheduled_at' => $scheduledAt,
            'started_at' => $scheduledAt,
            'completed_at' => $completedAt,
            'scheduled_by' => $admins->random()->id,
            'attendance_confirmed' => true,
            'test_location' => fake()->randomElement(['Online', 'Kantor Pusat - Lab Computer', 'Kantor Cabang']),
        ]);

        $assessmentCount++;
        $currentDate = $completedAt;

        // If failed at assessment stage, reject and stop
        if (!$assessmentPassed) {
            $application->update([
                'status_id' => $rejectedStatus,
                'current_stage' => ApplicationStatus::REJECTED,
            ]);
        }
    }

    private function processInterviewStage($application, &$currentDate, $admins, $interviewStageId, $rejectedStatus, $pendingStatus, &$interviewCount): void
    {
        $currentDate->addDays(rand(5, 14)); // Interview scheduling delay
        
        // Update application to interview stage
        $application->update([
            'current_stage' => ApplicationStatus::INTERVIEW,
            'current_stage_id' => $interviewStageId,
        ]);

        // 20% chance that interview is scheduled but not completed yet
        if (fake()->boolean(20)) {
            $scheduledAt = (clone $currentDate)->addDays(rand(1, 21)); // Future schedule
            
            ApplicationInterview::create([
                'application_id' => $application->id,
                'score' => null,
                'feedback' => 'Interview telah dijadwalkan, menunggu sesi interview dengan kandidat.',
                'evaluation_criteria' => null,
                'status' => 'scheduled',
                'scheduled_at' => $scheduledAt,
                'completed_at' => null,
                'interviewer_id' => $admins->random()->id,
                'is_online' => fake()->boolean(30), // 30% online interviews
                'location' => fake()->randomElement(['Kantor Pusat - Ruang Meeting A', 'Online via Zoom', 'Kantor Cabang']),
                'interview_type' => fake()->randomElement(['individual', 'panel', 'technical']),
            ]);

            $interviewCount++;
            
            // Keep application as pending in interview stage
            $application->update([
                'status_id' => $pendingStatus,
                'current_stage' => ApplicationStatus::INTERVIEW,
            ]);
            return;
        }

        $interviewScore = $this->generateRealisticScore(45, 95);
        $interviewPassed = $interviewScore >= self::INTERVIEW_PASSING_SCORE;
        
        $scheduledAt = (clone $currentDate)->addDays(rand(1, 7));
        $completedAt = (clone $scheduledAt)->addHour();
        
        ApplicationInterview::create([
                    'application_id' => $application->id,
            'score' => $interviewScore,
            'feedback' => $this->getInterviewFeedback($interviewScore),
            'evaluation_criteria' => $this->getEvaluationCriteria(),
            'status' => 'completed',
            'scheduled_at' => $scheduledAt,
            'completed_at' => $completedAt,
            'interviewer_id' => $admins->random()->id,
            'is_online' => fake()->boolean(30), // 30% online interviews
            'location' => fake()->randomElement(['Kantor Pusat - Ruang Meeting A', 'Online via Zoom', 'Kantor Cabang']),
            'interview_type' => fake()->randomElement(['individual', 'panel', 'technical']),
        ]);

        $interviewCount++;
        $currentDate = $completedAt;

        // If failed at interview stage, reject
        if (!$interviewPassed) {
            $application->update([
                'status_id' => $rejectedStatus,
                'current_stage' => ApplicationStatus::REJECTED,
            ]);
        }
    }

    private function makeFinalDecision($application, &$currentDate, $admins, $acceptedStatus, $rejectedStatus, $pendingStatus): void
    {
        $currentDate->addDays(rand(3, 10)); // Decision delay
        
        $interview = $application->interview;
        $interviewPassed = $interview && $interview->score >= self::INTERVIEW_PASSING_SCORE;
        
        if ($interviewPassed) {
            // 60% chance of acceptance, 20% pending, 20% rejected if passed all stages
            $random = fake()->numberBetween(1, 100);
            if ($random <= 60) {
                $finalDecision = 'accepted';
                $statusId = $acceptedStatus;
                $stage = ApplicationStatus::ACCEPTED;
            } elseif ($random <= 80) {
                $finalDecision = 'pending';
                $statusId = $pendingStatus;
                $stage = ApplicationStatus::PENDING;
            } else {
                $finalDecision = 'rejected';
                $statusId = $rejectedStatus;
                $stage = ApplicationStatus::REJECTED;
            }
        } else {
            // If interview failed, 10% chance still pending for reconsideration
            if (fake()->boolean(10)) {
                $finalDecision = 'pending';
                $statusId = $pendingStatus;
                $stage = ApplicationStatus::PENDING;
            } else {
                $finalDecision = 'rejected';
                $statusId = $rejectedStatus;
                $stage = ApplicationStatus::REJECTED;
            }
        }
        
        $application->update([
            'status_id' => $statusId,
            'current_stage' => $stage,
        ]);
    }

    private function createFinalReport($application, $currentDate, $admins, &$reportCount): void
    {
        $administration = $application->administration;
        $assessment = $application->assessment;
        $interview = $application->interview;

        $finalDecision = match($application->status->code) {
            'accepted' => 'accepted',
            'rejected' => 'rejected',
            default => 'pending',
        };

        // Only create report if application has progressed beyond administration or is final
        if ($finalDecision !== 'pending' || $administration?->status !== 'pending') {
            $currentDate->addDays(rand(1, 5)); // Report generation delay
            
            ApplicationReport::create([
                'application_id' => $application->id,
                'administration_score' => $administration?->score,
                'assessment_score' => $assessment?->score,
                'interview_score' => $interview?->score,
                'overall_score' => $this->calculateOverallScore($administration?->score, $assessment?->score, $interview?->score),
                'final_notes' => $this->getFinalNotes($finalDecision, $application->current_stage),
                'rejection_reason' => $finalDecision === 'rejected' ? $this->getRejectionReason($application->current_stage) : null,
                'recommendation' => $this->getRecommendation($finalDecision),
                'final_decision' => $finalDecision,
                'decision_made_by' => $finalDecision !== 'pending' ? $admins->random()->id : null,
                'decision_made_at' => $finalDecision !== 'pending' ? $currentDate : null,
                'report_generated_by' => $admins->random()->id,
                'report_generated_at' => $currentDate,
                'stage_summary' => $this->getStageSummary($administration?->score, $assessment?->score, $interview?->score),
                'strengths' => $this->getCandidateStrengths(),
                'weaknesses' => $this->getCandidateWeaknesses(),
            ]);
            
            $reportCount++;
        }
    }

    // Helper methods for generating realistic data
    private function generateRealisticScore($min = 0, $max = 100): float
    {
        // Generate scores with a bell curve-like distribution using beta distribution
        // This creates a slightly right-skewed distribution favoring higher scores
        $alpha = 3; // Shape parameter for right skew
        $beta = 2;  // Shape parameter
        
        // Generate a beta-distributed random number (0-1)
        $beta_value = $this->betaRandom($alpha, $beta);
        
        // Scale to our desired range
        $score = $min + ($max - $min) * $beta_value;
        
        return round($score, 2);
    }
    
    /**
     * Generate a beta-distributed random number using gamma distributions
     */
    private function betaRandom($alpha, $beta): float
    {
        $x = $this->gammaRandom($alpha);
        $y = $this->gammaRandom($beta);
        
        return $x / ($x + $y);
    }
    
    /**
     * Simple gamma distribution approximation
     */
    private function gammaRandom($shape): float
    {
        if ($shape < 1) {
            return $this->gammaRandom($shape + 1) * pow(fake()->randomFloat(0, 0, 1), 1 / $shape);
        }
        
        $d = $shape - 1/3;
        $c = 1 / sqrt(9 * $d);
        
        do {
            do {
                $x = fake()->numberBetween(-3, 3); // Approximation of normal distribution
                $v = 1 + $c * $x;
            } while ($v <= 0);
            
            $v = $v * $v * $v;
            $u = fake()->randomFloat(0, 0, 1);
        } while ($u > 1 - 0.0331 * $x * $x * $x * $x && log($u) > 0.5 * $x * $x + $d * (1 - $v + log($v)));
        
        return $d * $v;
    }

    private function getAdminNotes($score): string
    {
        if ($score >= 85) {
            return fake()->randomElement([
                'Dokumen lengkap dan sangat baik. Kualifikasi sangat sesuai dengan persyaratan.',
                'CV sangat mengesankan dengan pengalaman yang relevan.',
                'Semua persyaratan terpenuhi dengan sangat baik.'
            ]);
        } elseif ($score >= self::ADMIN_PASSING_SCORE) {
            return fake()->randomElement([
                'Dokumen lengkap dan memenuhi persyaratan dasar.',
                'Kualifikasi sesuai dengan yang dibutuhkan.',
                'Persyaratan minimum terpenuhi dengan baik.'
            ]);
        } else {
            return fake()->randomElement([
                'Beberapa dokumen tidak lengkap atau tidak sesuai persyaratan.',
                'Kualifikasi tidak memenuhi kriteria minimum.',
                'Pengalaman kerja tidak relevan dengan posisi yang dilamar.'
            ]);
        }
    }

    private function getDocumentsChecked(): string
    {
        return json_encode([
            'cv' => true,
            'cover_letter' => fake()->boolean(80),
            'certificates' => fake()->boolean(70),
            'portfolio' => fake()->boolean(60),
            'identity_card' => true,
            'diploma' => fake()->boolean(90),
        ]);
    }

    private function getRequirementsMet($passed): array
    {
        if ($passed) {
            return [
                'education' => true,
                'experience' => fake()->boolean(90),
                'skills' => fake()->boolean(85),
                'certifications' => fake()->boolean(70),
            ];
        }
        
        return [
            'education' => fake()->boolean(70),
            'experience' => fake()->boolean(60),
            'skills' => fake()->boolean(50),
            'certifications' => fake()->boolean(40),
        ];
    }

    private function getTestNotes($score): string
    {
        if ($score >= 80) {
            return fake()->randomElement([
                'Hasil tes sangat baik, menunjukkan kemampuan analitis yang kuat.',
                'Skor tinggi pada semua aspek yang diujikan.',
                'Performa sangat memuaskan dalam tes psikologi.'
            ]);
        } elseif ($score >= self::ASSESSMENT_PASSING_SCORE) {
            return fake()->randomElement([
                'Hasil tes memenuhi standar minimum dengan baik.',
                'Menunjukkan potensi yang cukup untuk dikembangkan.',
                'Skor memadai untuk melanjutkan ke tahap selanjutnya.'
            ]);
        } else {
            return fake()->randomElement([
                'Skor di bawah standar minimum yang ditetapkan.',
                'Beberapa aspek perlu perbaikan signifikan.',
                'Hasil tes tidak memenuhi kriteria yang diharapkan.'
            ]);
        }
    }

    private function getTestResults($score): array
    {
        return [
            'analytical_thinking' => round($score + fake()->numberBetween(-10, 10), 2),
            'problem_solving' => round($score + fake()->numberBetween(-10, 10), 2),
            'communication' => round($score + fake()->numberBetween(-15, 15), 2),
            'teamwork' => round($score + fake()->numberBetween(-10, 10), 2),
            'leadership_potential' => round($score + fake()->numberBetween(-20, 20), 2),
        ];
    }

    private function getInterviewFeedback($score): string
    {
        if ($score >= 85) {
            return fake()->randomElement([
                'Kandidat menunjukkan komunikasi yang sangat baik dan kepercayaan diri tinggi.',
                'Jawaban sangat terstruktur dan menunjukkan pemahaman mendalam.',
                'Sangat mengesankan dalam menyampaikan pengalaman dan visi karir.'
            ]);
        } elseif ($score >= self::INTERVIEW_PASSING_SCORE) {
            return fake()->randomElement([
                'Kandidat memberikan jawaban yang memadai dan menunjukkan potensi.',
                'Komunikasi cukup baik dengan beberapa poin yang perlu diperbaiki.',
                'Secara keseluruhan positif dengan ruang untuk pengembangan.'
            ]);
        } else {
            return fake()->randomElement([
                'Komunikasi kurang efektif dan jawaban tidak terfokus.',
                'Kandidat tampak kurang siap dan tidak yakin dengan jawaban.',
                'Beberapa jawaban tidak relevan dengan pertanyaan yang diajukan.'
            ]);
        }
    }

    private function getEvaluationCriteria(): array
    {
        return [
            'communication_skills' => fake()->numberBetween(1, 5),
            'technical_knowledge' => fake()->numberBetween(1, 5),
            'problem_solving' => fake()->numberBetween(1, 5),
            'cultural_fit' => fake()->numberBetween(1, 5),
            'motivation' => fake()->numberBetween(1, 5),
        ];
    }

    private function calculateOverallScore($admin, $assessment, $interview): ?float
    {
        $scores = array_filter([$admin, $assessment, $interview]);
        
        if (empty($scores)) {
            return null;
        }
        
        return round(array_sum($scores) / count($scores), 2);
    }

    private function getFinalNotes($decision, $currentStage): string
    {
        if ($decision === 'accepted') {
            return 'Kandidat telah melalui semua tahap seleksi dengan hasil yang memuaskan dan dinyatakan diterima.';
        } elseif ($decision === 'pending') {
            return 'Aplikasi masih dalam proses evaluasi di tahap ' . $this->getStageDisplayName($currentStage) . '. Menunggu penyelesaian tahap ini.';
        }
        
        return 'Kandidat tidak memenuhi standar minimum pada tahap ' . $this->getStageDisplayName($currentStage);
    }

    private function getRejectionReason($currentStage): string
    {
        return match($currentStage->value) {
            'administrative_selection' => fake()->randomElement([
                'Dokumen tidak lengkap',
                'Kualifikasi tidak sesuai persyaratan',
                'Pengalaman tidak relevan'
            ]),
            'psychological_test' => fake()->randomElement([
                'Skor tes psikologi di bawah standar minimum',
                'Tidak lulus tes kemampuan analitis',
                'Hasil tes tidak memenuhi kriteria'
            ]),
            'interview' => fake()->randomElement([
                'Performa interview tidak memuaskan',
                'Komunikasi kurang efektif',
                'Tidak menunjukkan cultural fit yang diharapkan'
            ]),
            default => 'Tidak memenuhi kriteria seleksi'
        };
    }

    private function getRecommendation($decision): string
    {
        if ($decision === 'accepted') {
            return 'Sangat direkomendasikan untuk bergabung dengan perusahaan';
        } elseif ($decision === 'pending') {
            return 'Masih dalam evaluasi, menunggu penyelesaian tahap seleksi yang sedang berjalan';
        }
        
        return 'Tidak direkomendasikan untuk posisi ini berdasarkan hasil evaluasi';
    }

    private function getStageDisplayName($stage): string
    {
        return match($stage->value) {
            'administrative_selection' => 'Seleksi Administrasi',
            'psychological_test' => 'Tes Psikologi',
            'interview' => 'Interview',
            'pending' => 'Evaluasi',
            'accepted' => 'Diterima',
            'rejected' => 'Ditolak',
            default => 'Tahap Seleksi'
        };
    }

    private function getStageSummary($admin, $assessment, $interview): array
    {
        $summary = [];
        
        if ($admin !== null) {
            $summary['administration'] = [
                'score' => $admin,
                'status' => $admin >= self::ADMIN_PASSING_SCORE ? 'passed' : 'failed',
                'notes' => 'Tahap seleksi administrasi'
            ];
        }
        
        if ($assessment !== null) {
            $summary['assessment'] = [
                'score' => $assessment,
                'status' => $assessment >= self::ASSESSMENT_PASSING_SCORE ? 'passed' : 'failed',
                'notes' => 'Tahap tes psikologi'
            ];
        }
        
        if ($interview !== null) {
            $summary['interview'] = [
                'score' => $interview,
                'status' => $interview >= self::INTERVIEW_PASSING_SCORE ? 'passed' : 'failed',
                'notes' => 'Tahap interview'
            ];
        }
        
        return $summary;
    }

    private function getCandidateStrengths(): array
    {
        return fake()->randomElements([
            'Komunikasi yang baik',
            'Pengalaman relevan',
            'Kemampuan analitis',
            'Motivasi tinggi',
            'Keterampilan teknis',
            'Kemampuan bekerja dalam tim',
            'Leadership potential',
            'Adaptabilitas',
            'Problem solving',
            'Kreativitas'
        ], fake()->numberBetween(2, 4));
    }

    private function getCandidateWeaknesses(): array
    {
        return fake()->randomElements([
            'Perlu peningkatan komunikasi',
            'Pengalaman masih terbatas',
            'Kurang percaya diri',
            'Perlu pengembangan soft skills',
            'Kemampuan teknis perlu diasah',
            'Manajemen waktu',
            'Presentasi skills',
            'Bahasa Inggris',
            'Computer literacy',
            'Industry knowledge'
        ], fake()->numberBetween(1, 3));
    }
} 