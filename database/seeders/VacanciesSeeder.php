<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Company;
use App\Models\User;
use App\Models\Vacancies;
use App\Models\QuestionPack;
use Illuminate\Database\Seeder;

class VacanciesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a user to associate with the jobs
        $user = User::where('role', UserRole::HR->value)->first() ?? User::factory()->create(['role' => UserRole::HR->value]);
        
        // Get the companies to associate with the vacancies
        $companies = Company::all();
        
        if ($companies->isEmpty()) {
            $this->command->info('No companies found. Running CompanySeeder first.');
            $this->call(CompanySeeder::class);
            $companies = Company::all();
        }

        // Get question packs
        $questionPacks = QuestionPack::all();
        
        if ($questionPacks->isEmpty()) {
            $this->command->info('No question packs found. Running QuestionPackSeeder first.');
            $this->call(QuestionPackSeeder::class);
            $questionPacks = QuestionPack::all();
        }
        
        // Get the relevant IDs for seeding
        $mitraKaryaId = $companies->where('name', 'Mitra Karya Analitika')->first()->id ?? 1;
        $autentikKaryaId = $companies->where('name', 'Autentik Karya Analitika')->first()->id ?? 2;
        
        // Get question pack IDs
        $generalAssessmentId = $questionPacks->where('pack_name', 'General Assessment')->first()->id ?? null;
        $techAssessmentId = $questionPacks->where('pack_name', 'Technical Assessment')->first()->id ?? null;
        $marketingAssessmentId = $questionPacks->where('pack_name', 'Marketing Assessment')->first()->id ?? null;

        $vacancies = [
            [
                'title' => 'BUSINESS EXECUTIVE',
                'department' => 'Marketing',
                'location' => 'Semarang',
                'salary' => 'Rp. 4.000.000 - 6.000.000',
                'requirements' => [
                    'Laki-laki atau perempuan',
                    'SMK Analis Kimia, D3 Analis Kimia atau relevan',
                    'Berpengalaman di bidang marketing minimal 1 tahun',
                    'Komunikatif, Cekatan, Jujur, teliti dan bersedia mobile working',
                ],
                'benefits' => [
                    'Gaji pokok kompetitif',
                    'Asuransi kesehatan',
                    'Tunjangan transport',
                    'Pelatihan dan pengembangan karir',
                ],
                'user_id' => $user->id,
                'company_id' => $mitraKaryaId,
                'question_pack_id' => $marketingAssessmentId,
            ],
            [
                'title' => 'PRODUCT SPECIALIST ENVIRONMENTAL',
                'department' => 'Teknik',
                'location' => 'Semarang',
                'salary' => 'Rp. 5.000.000 - 8.000.000',
                'requirements' => [
                    'Laki-laki atau perempuan',
                    'S1 Teknik Lingkungan atau relevan',
                    'Berpengalaman di environmental, memiliki kemampuan komunikasi yang baik',
                    'Cekatan, Jujur, Works with minimal supervision dan bersedia mobile working',
                ],
                'benefits' => [
                    'Gaji kompetitif',
                    'Asuransi kesehatan',
                    'Pengembangan karir',
                    'Lingkungan kerja yang dinamis',
                ],
                'user_id' => $user->id,
                'company_id' => $mitraKaryaId,
                'question_pack_id' => $techAssessmentId,
            ],
            [
                'title' => 'STAFF ACCOUNTING INTERN',
                'department' => 'Akuntansi',
                'location' => 'Bandung',
                'salary' => 'Rp. 1.500.000 - 2.500.000',
                'requirements' => [
                    'Laki-laki atau perempuan',
                    'Sekolah Menengah Kejuruan jurusan Akuntansi atau setara',
                    'Cekatan, Jujur, dan mau belajar',
                ],
                'benefits' => [
                    'Uang Saku',
                    'Sertifikat',
                    'Ilmu yang bermanfaat dan relasi',
                ],
                'user_id' => $user->id,
                'company_id' => $autentikKaryaId,
                'question_pack_id' => $generalAssessmentId,
            ],
            [
                'title' => 'BUSINESS EXECUTIVE HSE',
                'department' => 'Kesehatan',
                'location' => 'Semarang',
                'salary' => 'Rp. 4.500.000 - 7.000.000',
                'requirements' => [
                    'D3/S1 Analis Kesehatan, atau relevan',
                    'Memiliki kemampuan komunikasi yang baik',
                    'Cekatan, Jujur, Works with minimal supervision dan bersedia mobile working',
                    'Diutamakan memiliki pengalaman di bidang marketing atau sebagai user di Laboratorium',
                ],
                'benefits' => [
                    'Gaji kompetitif',
                    'Asuransi kesehatan',
                    'Tunjangan kinerja',
                    'Program pengembangan karir',
                ],
                'user_id' => $user->id,
                'company_id' => $autentikKaryaId,
                'question_pack_id' => $marketingAssessmentId,
            ],
            [
                'title' => 'TEKNISI KALIBRASI',
                'department' => 'Teknik',
                'location' => 'Semarang',
                'salary' => 'Rp. 3.500.000 - 5.000.000',
                'requirements' => [
                    'Minimal D3 Teknik Elektro, Teknik Mesin atau Relevan',
                    'Memiliki kemampuan komunikasi yang baik',
                    'Cekatan, Jujur, Works with minimal supervision dan bersedia mobile working',
                    'Jujur, Ulet dan Proaktif',
                ],
                'benefits' => [
                    'Gaji kompetitif',
                    'BPJS Kesehatan dan Ketenagakerjaan',
                    'Tunjangan transport',
                    'Pelatihan teknis berkala',
                ],
                'user_id' => $user->id,
                'company_id' => $mitraKaryaId,
                'question_pack_id' => $techAssessmentId,
            ],
        ];

        foreach ($vacancies as $vacancy) {
            Vacancies::create($vacancy);
        }
    }
}
