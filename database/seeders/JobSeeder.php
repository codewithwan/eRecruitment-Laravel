<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Companies;
use App\Models\MasterMajor;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companyMKA = Companies::where('name', 'PT MITRA KARYA ANALITIKA')->first();
        $companyAKA = Companies::where('name', 'PT AUTENTIK KARYA ANALITIKA')->first();

        $majorTI = MasterMajor::where('name', 'Teknik Informatika')->first();
        $majorManajemen = MasterMajor::where('name', 'Manajemen')->first();
        $majorAkuntansi = MasterMajor::where('name', 'Akuntansi')->first();

        // Cek semua referensi wajib ada
        if (!$companyMKA || !$companyAKA || !$majorTI || !$majorManajemen || !$majorAkuntansi) {
            // Bisa juga pakai throw, log, atau echo
            echo "GAGAL: Pastikan data companies dan master_majors sudah ada sebelum menjalankan JobSeeder.\n";
            return;
        }

        $jobs = [
            [
                'title' => 'Software Engineer',
                'major_id' => $majorTI->id,
                'company_id' => $companyMKA->id,
                'queue' => 'default',
                'payload' => '{}',
                'attempts' => 0,
                'reserved_at' => null,
                'available_at' => time(),
                'created_at' => time(),
            ],
            [
                'title' => 'Backend Developer',
                'major_id' => $majorTI?->id,
                'company_id' => $companyAKA?->id,
                'queue' => 'default',
                'payload' => '{}',
                'attempts' => 0,
                'reserved_at' => null,
                'available_at' => time(),
                'created_at' => time(),
            ],
            [
                'title' => 'Frontend Developer',
                'major_id' => $majorTI?->id,
                'company_id' => $companyMKA?->id,
                'queue' => 'default',
                'payload' => '{}',
                'attempts' => 0,
                'reserved_at' => null,
                'available_at' => time(),
                'created_at' => time(),
            ],
            [
                'title' => 'Manajemen Trainee',
                'major_id' => $majorManajemen?->id,
                'company_id' => $companyAKA?->id,
                'queue' => 'default',
                'payload' => '{}',
                'attempts' => 0,
                'reserved_at' => null,
                'available_at' => time(),
                'created_at' => time(),
            ],
            [
                'title' => 'Staff Administrasi',
                'major_id' => $majorManajemen?->id,
                'company_id' => $companyMKA?->id,
                'queue' => 'default',
                'payload' => '{}',
                'attempts' => 0,
                'reserved_at' => null,
                'available_at' => time(),
                'created_at' => time(),
            ],
            [
                'title' => 'Akuntan',
                'major_id' => $majorAkuntansi?->id,
                'company_id' => $companyMKA?->id,
                'queue' => 'default',
                'payload' => '{}',
                'attempts' => 0,
                'reserved_at' => null,
                'available_at' => time(),
                'created_at' => time(),
            ],
            [
                'title' => 'Finance Officer',
                'major_id' => $majorAkuntansi?->id,
                'company_id' => $companyAKA?->id,
                'queue' => 'default',
                'payload' => '{}',
                'attempts' => 0,
                'reserved_at' => null,
                'available_at' => time(),
                'created_at' => time(),
            ],
            [
                'title' => 'Data Analyst',
                'major_id' => $majorTI?->id,
                'company_id' => $companyMKA?->id,
                'queue' => 'default',
                'payload' => '{}',
                'attempts' => 0,
                'reserved_at' => null,
                'available_at' => time(),
                'created_at' => time(),
            ],
            [
                'title' => 'Project Manager',
                'major_id' => $majorManajemen?->id,
                'company_id' => $companyAKA?->id,
                'queue' => 'default',
                'payload' => '{}',
                'attempts' => 0,
                'reserved_at' => null,
                'available_at' => time(),
                'created_at' => time(),
            ],
            [
                'title' => 'IT Support',
                'major_id' => $majorTI?->id,
                'company_id' => $companyMKA?->id,
                'queue' => 'default',
                'payload' => '{}',
                'attempts' => 0,
                'reserved_at' => null,
                'available_at' => time(),
                'created_at' => time(),
            ],
            // Tambahkan lebih banyak data sesuai kebutuhan
        ];

        DB::table('jobs')->insert($jobs);
    }
}
