<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\User;
use App\Models\Vacancies;
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

        // Get department IDs from correct table name
        $departments = Department::query()
            ->from('department') // Specify the correct table name
            ->pluck('id', 'name');

        $vacancies = [
            [
                'title' => 'BUSINESS EXECUTIVE',
                'department_id' => $departments['Marketing'],
                'location' => 'Semarang',
                'requirements' => [
                    'Laki-laki atau perempuan',
                    'SMK Analis Kimia, D3 Analis Kimia atau relevan',
                    'Berpengalaman di bidang marketing minimal 1 tahun',
                    'Komunikatif, Cekatan, Jujur, teliti dan bersedia mobile working',
                ],
                'benefits' => null,
                'user_id' => $user->id,
            ],
            [
                'title' => 'PRODUCT SPECIALIST ENVIRONMENTAL',
                'department_id' => $departments['Teknik'],
                'location' => 'Semarang',
                'requirements' => [
                    'Laki-laki atau perempuan',
                    'S1 Teknik Lingkungan atau relevan',
                    'Berpengalaman di environmental, memiliki kemampuan komunikasi yang baik',
                    'Cekatan, Jujur, Works with minimal supervision dan bersedia mobile working',
                ],
                'benefits' => null,
                'user_id' => $user->id,
            ],
            [
                'title' => 'STAFF ACCOUNTING INTERN',
                'department_id' => $departments['Akuntansi'],
                'location' => 'Bandung',
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
            ],
            [
                'title' => 'BUSINESS EXECUTIVE HSE',
                'department_id' => $departments['Kesehatan'],
                'location' => 'Semarang',
                'requirements' => [
                    'D3/S1 Analis Kesehatan, atau relevan',
                    'Memiliki kemampuan komunikasi yang baik',
                    'Cekatan, Jujur, Works with minimal supervision dan bersedia mobile working',
                    'Diutamakan memiliki pengalaman di bidang marketing atau sebagai user di Laboratorium',
                ],
                'benefits' => null,
                'user_id' => $user->id,
            ],
            [
                'title' => 'TEKNISI KALIBRASI',
                'department_id' => $departments['Teknik'],
                'location' => 'Semarang',
                'requirements' => [
                    'Minimal D3 Teknik Elektro, Teknik Mesin atau Relevan',
                    'Memiliki kemampuan komunikasi yang baik',
                    'Cekatan, Jujur, Works with minimal supervision dan bersedia mobile working',
                    'Jujur, Ulet dan Proaktif',
                ],
                'benefits' => null,
                'user_id' => $user->id,
            ],
        ];

        foreach ($vacancies as $vacancy) {
            Vacancies::create($vacancy);
        }
    }
}
