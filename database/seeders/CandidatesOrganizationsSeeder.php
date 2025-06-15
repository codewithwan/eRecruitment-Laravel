<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\CandidatesOrganizations;
use App\Enums\UserRole;

class CandidatesOrganizationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $candidates = User::where('role', UserRole::CANDIDATE)->get();

        $months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        foreach ($candidates as $user) {
            CandidatesOrganizations::create([
                'user_id' => $user->id,
                'organization_name' => 'BEM Kampus',
                'position' => 'Anggota',
                'start_month' => $months[array_rand($months)], // Random month for start
                'start_year' => rand(2017, 2020),
                'end_month' => $months[array_rand($months)], // Random month for end
                'end_year' => rand(2021, 2023),
                'description' => 'Aktif dalam kegiatan organisasi mahasiswa.',
                'is_active' => false,
            ]);
        }
    }
}
