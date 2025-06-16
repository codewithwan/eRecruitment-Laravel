<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\Companies;
use App\Models\JobTypes;
use App\Models\User;
use App\Models\Vacancies;
use App\Models\MasterMajor;
use Illuminate\Database\Seeder;

class VacanciesSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('role', UserRole::HR->value)->first() ?? User::factory()->create(['role' => UserRole::HR->value]);
        $departments = Department::pluck('id', 'name');

        // Ambil jurusan dari master_majors
        $ti = MasterMajor::where('name', 'Teknik Informatika')->first();
        $manajemen = MasterMajor::where('name', 'Manajemen')->first();
        $komunikasi = MasterMajor::where('name', 'Komunikasi')->first();
        $dkv = MasterMajor::where('name', 'Desain Komunikasi Visual')->first();
        $psikologi = MasterMajor::where('name', 'Psikologi')->first();
        $akuntansi = MasterMajor::where('name', 'Akuntansi')->first();

        $mka = Companies::firstOrCreate(
            ['name' => 'PT MITRA KARYA ANALITIKA'],
            ['description' => 'Perusahaan teknologi yang berfokus pada pengembangan hardware.', 'address' => 'Semarang']
        );
        $aka = Companies::firstOrCreate(
            ['name' => 'PT AUTENTIK KARYA ANALITIKA'],
            ['description' => 'Perusahaan yang bergerak di bidang jasa pengujian dan analisa.', 'address' => 'Jakarta']
        );

        $fullTime = JobTypes::firstOrCreate(['name' => 'Full Time']);
        $partTime = JobTypes::firstOrCreate(['name' => 'Part Time']);
        $contract = JobTypes::firstOrCreate(['name' => 'Contract']);
        $intern = JobTypes::firstOrCreate(['name' => 'Internship']);

        $vacancies = [
            [
                'title' => 'FRONTEND DEVELOPER',
                'department_id' => $departments['IT'],
                'company_id' => $mka->id,
                'type_id' => $fullTime->id,
                'location' => 'Semarang',
                'major_id' => $ti?->id, // <--- filter jurusan
                'requirements' => [
                    'Min. S1 Teknik Informatika/Sistem Informasi',
                    'Menguasai React.js, Vue.js, atau Angular',
                ],
                'job_description' => 'Mengembangkan dan memelihara aplikasi web.',
                'benefits' => ['BPJS', 'Gaji di atas UMR'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'MARKETING INTERN',
                'department_id' => $departments['Marketing'],
                'company_id' => $aka->id,
                'type_id' => $intern->id,
                'location' => 'Jakarta',
                'major_id' => $komunikasi?->id,
                'requirements' => [
                    'Mahasiswa semester akhir',
                    'Jurusan Marketing/Komunikasi',
                ],
                'job_description' => 'Membantu tim marketing.',
                'benefits' => ['Uang Transport', 'Sertifikat'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'UI/UX DESIGNER',
                'department_id' => $departments['IT'],
                'company_id' => $mka->id,
                'type_id' => $partTime->id,
                'location' => 'Semarang',
                'major_id' => $dkv?->id,
                'requirements' => [
                    'Min. D3 Desain Komunikasi Visual',
                ],
                'job_description' => 'Mendesain tampilan aplikasi web dan mobile.',
                'benefits' => ['BPJS', 'Gaji Proyek'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'HR INTERN',
                'department_id' => $departments['HR'],
                'company_id' => $aka->id,
                'type_id' => $intern->id,
                'location' => 'Jakarta',
                'major_id' => $psikologi?->id,
                'requirements' => [
                    'Mahasiswa Psikologi/Manajemen',
                ],
                'job_description' => 'Membantu proses rekrutmen dan administrasi HR.',
                'benefits' => ['Uang Saku', 'Sertifikat'],
                'user_id' => $user->id,
            ],
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
                'major_id' => $manajemen?->id, // <-- pastikan ini ID jurusan Manajemen
                'requirements' => [
                    'S1 Manajemen',
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
                'major_id' => $psikologi?->id,
                'requirements' => [
                    'Mahasiswa Psikologi/Manajemen',
                ],
                'job_description' => 'Membantu proses rekrutmen dan administrasi HR.',
                'benefits' => ['Uang Saku', 'Sertifikat'],
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
            [
                'title' => 'STAFF ACCOUNTING',
                'department_id' => $departments['Akuntansi'],
                'company_id' => $mka->id,
                'type_id' => $fullTime->id,
                'location' => 'Semarang',
                'major_id' => $akuntansi?->id, // <-- pastikan ini ID jurusan Akuntansi
                'requirements' => [
                    'S1 Akuntansi',
                    'Menguasai software akuntansi',
                    'Teliti dan bertanggung jawab',
                ],
                'job_description' => 'Mengelola laporan keuangan perusahaan.',
                'benefits' => ['BPJS', 'Gaji UMR', 'Tunjangan Hari Raya'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'PSYCHOLOGIST STAFF',
                'department_id' => $departments['HR'],
                'company_id' => $mka->id,
                'type_id' => $fullTime->id,
                'location' => 'Semarang',
                'major_id' => $psikologi?->id, // <-- jurusan Psikologi
                'requirements' => [
                    'S1 Psikologi',
                    'Berpengalaman dalam asesmen psikologi',
                    'Mampu melakukan konseling karyawan',
                    'Komunikatif dan empati tinggi',
                ],
                'job_description' => 'Melakukan asesmen, konseling, dan pengembangan SDM di perusahaan.',
                'benefits' => ['BPJS', 'Gaji Kompetitif', 'Tunjangan Kesehatan'],
                'user_id' => $user->id,
            ],
            [
                'title' => 'RECRUITMENT SPECIALIST',
                'department_id' => $departments['HR'],
                'company_id' => $aka->id,
                'type_id' => $fullTime->id,
                'location' => 'Jakarta',
                'major_id' => $psikologi?->id, // <-- jurusan Psikologi
                'requirements' => [
                    'S1 Psikologi',
                    'Pengalaman minimal 1 tahun di bidang rekrutmen',
                    'Mampu melakukan interview dan psikotes',
                    'Mampu bekerja dalam tim',
                ],
                'job_description' => 'Bertanggung jawab dalam proses rekrutmen dan seleksi karyawan.',
                'benefits' => ['BPJS', 'Bonus Rekrutmen', 'Sertifikat'],
                'user_id' => $user->id,
            ],
        ];

        foreach ($vacancies as $vacancy) {
            Vacancies::create($vacancy);
        }
    }
}
