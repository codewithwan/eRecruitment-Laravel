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
            [
                'title' => 'UI/UX DESIGNER',
                'department_id' => $departments['IT'],
                'company_id' => $mka->id,
                'type_id' => $partTime->id,
                'location' => 'Semarang',
                'requirements' => [
                    'Min. D3 Desain Komunikasi Visual',
                    'Menguasai Figma, Adobe XD, atau Sketch',
                    'Berpengalaman membuat prototype aplikasi',
                    'Kreatif dan komunikatif',
                ],
                'job_description' => 'Mendesain tampilan aplikasi web dan mobile serta melakukan usability testing.',
                'benefits' => ['BPJS', 'Gaji Proyek', 'Remote Working'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'QA ENGINEER',
                'department_id' => $departments['IT'],
                'company_id' => $mka->id,
                'type_id' => $contract->id,
                'location' => 'Semarang',
                'requirements' => [
                    'S1 Teknik Informatika/Sistem Informasi',
                    'Pengalaman minimal 1 tahun di QA',
                    'Menguasai automation testing',
                    'Teliti dan detail',
                ],
                'job_description' => 'Melakukan pengujian aplikasi dan membuat laporan bug.',
                'benefits' => ['BPJS', 'Bonus Proyek', 'Training'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'DATA ANALYST INTERN',
                'department_id' => $departments['IT'],
                'company_id' => $aka->id,
                'type_id' => $intern->id,
                'location' => 'Jakarta',
                'requirements' => [
                    'Mahasiswa semester akhir',
                    'Menguasai Excel dan dasar SQL',
                    'Mampu membuat laporan data',
                    'Komunikatif',
                ],
                'job_description' => 'Membantu tim dalam analisa data dan pembuatan laporan.',
                'benefits' => ['Uang Saku', 'Sertifikat', 'Pengalaman Kerja'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'MOBILE APP DEVELOPER',
                'department_id' => $departments['IT'],
                'company_id' => $mka->id,
                'type_id' => $fullTime->id,
                'location' => 'Semarang',
                'requirements' => [
                    'S1 Teknik Informatika/Sistem Informasi',
                    'Menguasai Flutter atau React Native',
                    'Pengalaman membuat aplikasi Android/iOS',
                    'Mampu bekerja dalam tim',
                ],
                'job_description' => 'Mengembangkan aplikasi mobile untuk kebutuhan perusahaan.',
                'benefits' => ['BPJS', 'Gaji di atas UMR', 'Remote Working'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'CONTENT CREATOR',
                'department_id' => $departments['Marketing'],
                'company_id' => $aka->id,
                'type_id' => $partTime->id,
                'location' => 'Jakarta',
                'requirements' => [
                    'Min. SMA/SMK',
                    'Kreatif membuat konten digital',
                    'Menguasai aplikasi editing foto/video',
                    'Aktif di media sosial',
                ],
                'job_description' => 'Membuat konten promosi untuk media sosial perusahaan.',
                'benefits' => ['Uang Transport', 'Bonus Konten', 'Sertifikat'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'PROJECT MANAGER',
                'department_id' => $departments['IT'],
                'company_id' => $mka->id,
                'type_id' => $contract->id,
                'location' => 'Semarang',
                'requirements' => [
                    'S1 Teknik Informatika/Manajemen',
                    'Pengalaman minimal 2 tahun sebagai PM',
                    'Mampu memimpin tim',
                    'Komunikatif dan bertanggung jawab',
                ],
                'job_description' => 'Mengelola proyek pengembangan aplikasi dari awal hingga selesai.',
                'benefits' => ['BPJS', 'Bonus Proyek', 'Training'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'HR INTERN',
                'department_id' => $departments['HR'],
                'company_id' => $aka->id,
                'type_id' => $intern->id,
                'location' => 'Jakarta',
                'requirements' => [
                    'Mahasiswa Psikologi/Manajemen',
                    'Komunikatif dan teliti',
                    'Mampu mengoperasikan MS Office',
                    'Bersedia magang minimal 3 bulan',
                ],
                'job_description' => 'Membantu proses rekrutmen dan administrasi HR.',
                'benefits' => ['Uang Saku', 'Sertifikat', 'Pengalaman Kerja'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'CUSTOMER SUPPORT',
                'department_id' => $departments['Marketing'],
                'company_id' => $mka->id,
                'type_id' => $fullTime->id,
                'location' => 'Semarang',
                'requirements' => [
                    'Min. D3 Semua Jurusan',
                    'Komunikatif dan sabar',
                    'Berpengalaman di bidang customer service',
                    'Mampu bekerja shift',
                ],
                'job_description' => 'Memberikan layanan dan solusi kepada pelanggan.',
                'benefits' => ['BPJS', 'Gaji UMR', 'Tunjangan Shift'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'GRAPHIC DESIGNER',
                'department_id' => $departments['Marketing'],
                'company_id' => $aka->id,
                'type_id' => $partTime->id,
                'location' => 'Jakarta',
                'requirements' => [
                    'Min. D3 Desain Grafis',
                    'Menguasai CorelDraw, Photoshop, Illustrator',
                    'Kreatif dan inovatif',
                    'Berpengalaman membuat materi promosi',
                ],
                'job_description' => 'Membuat desain grafis untuk kebutuhan promosi perusahaan.',
                'benefits' => ['Uang Transport', 'Bonus Proyek', 'Sertifikat'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'SYSTEM ANALYST',
                'department_id' => $departments['IT'],
                'company_id' => $mka->id,
                'type_id' => $contract->id,
                'location' => 'Semarang',
                'requirements' => [
                    'S1 Teknik Informatika/Sistem Informasi',
                    'Pengalaman minimal 2 tahun sebagai System Analyst',
                    'Mampu membuat dokumentasi sistem',
                    'Komunikatif',
                ],
                'job_description' => 'Menganalisa kebutuhan sistem dan membuat dokumentasi teknis.',
                'benefits' => ['BPJS', 'Bonus Proyek', 'Training'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'MARKETING INTERN',
                'department_id' => $departments['Marketing'],
                'company_id' => $aka->id,
                'type_id' => $intern->id,
                'location' => 'Jakarta',
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
                'title' => 'HARDWARE ENGINEER',
                'department_id' => $departments['IT'],
                'company_id' => $aka->id,
                'type_id' => $fullTime->id,
                'location' => 'Semarang',
                'requirements' => [
                    "Associate/Bachelor's degree in Electrical Engineering, Mechatronics, Electromechanics, or related fields;",
                    "Advanced knowledge of robotics, embedded programming, PCB layout, and PCB design;",
                    "Not color blind",
                    "Willing to be placed in Semarang City"
                ],
                'job_description' => "An expert who designs, develops, and tests hardware, including PCB design and electronic component integration, for applications such as robotics and embedded systems.\n\nIf you are interested in electronics, robotics, and PCB design and want to work in an innovative environment, you are the right candidate for this position.",
                'benefits' => [
                    "Basic Salary",
                    "Training",
                    "Other benefits"
                ],
                'user_id' => $user->id,
            ],
        ];

        foreach ($vacancies as $vacancy) {
            Vacancies::create($vacancy);
        }
    }
}
