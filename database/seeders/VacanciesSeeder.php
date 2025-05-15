<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\Companies;
use App\Models\JobTypes;
use App\Models\User;
use App\Models\Vacancies;
use Illuminate\Database\Seeder;

class VacanciesSeeder extends Seeder
{
    public function run(): void
    {
        // Get a user to associate with the jobs
        $user = User::where('role', UserRole::HR->value)->first() ?? User::factory()->create(['role' => UserRole::HR->value]);

        // Get department IDs
        $departments = Department::pluck('id', 'name');

        // Create companies
        $mka = Companies::firstOrCreate(
            ['name' => 'PT MITRA KARYA ANALITIKA'],  // Changed to all caps
            [
                'description' => 'Perusahaan teknologi yang berfokus pada pengembangan hardware.',
                'address' => 'Semarang'
            ]
        );

        $aka = Companies::firstOrCreate(
            ['name' => 'PT AUTENTIK KARYA ANALITIKA'],
            [
                'description' => 'Perusahaan yang bergerak di bidang jasa pengujian dan analisa.',
                'address' => 'Jakarta'
            ]
        );

        // Create job types
        $fullTime = JobTypes::firstOrCreate(['name' => 'Full Time']);
        $partTime = JobTypes::firstOrCreate(['name' => 'Part Time']);
        $contract = JobTypes::firstOrCreate(['name' => 'Contract']);
        $intern = JobTypes::firstOrCreate(['name' => 'Internship']);

        $vacancies = [
            [
                'title' => 'BUSINESS EXECUTIVE',
                'department_id' => $departments['Marketing'],
                'company_id' => $mka->id,
                'type_id' => $fullTime->id,
                'location' => 'Semarang',
                'deadline' => now()->addDays(30),  // 30 days from now
                'requirements' => [
                    'Laki-laki atau perempuan',
                    'SMK Analis Kimia, D3 Analis Kimia atau relevan',
                    'Berpengalaman di bidang marketing minimal 1 tahun',
                    'Komunikatif, Cekatan, Jujur, teliti dan bersedia mobile working',
                ],
                'job_description' => 'Melakukan penjualan produk dan jasa perusahaan kepada customer.',
                'benefits' => ['BPJS', 'Gaji UMR', 'Tunjangan Hari Raya'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'FRONTEND DEVELOPER',
                'department_id' => $departments['IT'],
                'company_id' => $mka->id,
                'type_id' => $fullTime->id,
                'location' => 'Semarang',
                'deadline' => now()->addDays(45),  // 45 days from now
                'requirements' => [
                    'Min. S1 Teknik Informatika/Sistem Informasi',
                    'Menguasai React.js, Vue.js, atau Angular',
                    'Memahami HTML, CSS, dan JavaScript',
                    'Pengalaman 2 tahun di bidang Frontend Development',
                ],
                'job_description' => 'Mengembangkan dan memelihara aplikasi web dengan fokus pada user interface dan user experience.',
                'benefits' => ['BPJS', 'Gaji di atas UMR', 'Tunjangan Hari Raya', 'Remote Working'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'MARKETING INTERN',
                'department_id' => $departments['Marketing'],
                'company_id' => $aka->id,
                'type_id' => $intern->id,
                'location' => 'Jakarta',
                'deadline' => now()->addDays(15),  // 15 days from now
                'requirements' => [
                    'Mahasiswa semester akhir',
                    'Jurusan Marketing/Komunikasi',
                    'Kreatif dan inovatif',
                    'Mampu menggunakan social media untuk marketing',
                ],
                'job_description' => 'Membantu tim marketing dalam kampanye digital dan analisis pasar.',
                'benefits' => ['Uang Transport', 'Sertifikat', 'Training'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'BACKEND DEVELOPER',
                'department_id' => $departments['IT'],
                'company_id' => $mka->id,
                'type_id' => $fullTime->id,
                'location' => 'Semarang',
                'deadline' => now()->addDays(60),  // 60 days from now
                'requirements' => [
                    'S1 Teknik Informatika/Sistem Informasi',
                    'Menguasai PHP/Laravel atau Node.js',
                    'Pengalaman dengan REST API',
                    'Paham database MySQL/PostgreSQL',
                ],
                'job_description' => 'Mengembangkan backend system dan API untuk aplikasi perusahaan.',
                'benefits' => ['BPJS', 'Gaji di atas UMR', 'WFH Option', 'Training'],
                'user_id' => $user->id,
            ],
        ];

        foreach ($vacancies as $vacancy) {
            Vacancies::create($vacancy);
        }
    }
}
