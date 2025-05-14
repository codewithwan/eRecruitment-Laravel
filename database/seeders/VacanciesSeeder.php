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

        // Get a company
        $company = Companies::first() ?? Companies::create([
            'name' => 'PT MITRA KARYA ANALITIKA',
            'description' => 'Perusahaan teknologi yang berfokus pada pengembangan hardware.'
        ]);

        // Get job type
        $jobType = JobTypes::where('name', 'Full Time')->first() ?? JobTypes::create(['name' => 'Full Time']);

        $vacancies = [
            [
                'title' => 'BUSINESS EXECUTIVE',
                'department_id' => $departments['Marketing'],
                'company_id' => $company->id,
                'type_id' => $jobType->id,
                'location' => 'Semarang',
                'requirements' => [
                    'Laki-laki atau perempuan',
                    'SMK Analis Kimia, D3 Analis Kimia atau relevan',
                    'Berpengalaman di bidang marketing minimal 1 tahun',
                    'Komunikatif, Cekatan, Jujur, teliti dan bersedia mobile working',
                ],
                'job_description' => 'Melakukan penjualan produk dan jasa perusahaan kepada customer.',
                'benefits' => null,
                'user_id' => $user->id,
            ],
            // ... rest of your vacancies array ...
        ];

        foreach ($vacancies as $vacancy) {
            // Add company_id and type_id to all vacancies if not set
            if (!isset($vacancy['company_id'])) {
                $vacancy['company_id'] = $company->id;
            }
            if (!isset($vacancy['type_id'])) {
                $vacancy['type_id'] = $jobType->id;
            }
            Vacancies::create($vacancy);
        }
    }
}
