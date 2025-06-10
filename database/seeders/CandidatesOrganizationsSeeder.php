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

        foreach ($candidates as $user) {
            CandidatesOrganizations::create([
                'user_id' => $user->id,
                'organization_name' => 'BEM Kampus',
                'position' => 'Anggota',
                'start_year' => rand(2017, 2020),
                'end_year' => rand(2021, 2023),
                'description' => 'Aktif dalam kegiatan organisasi mahasiswa.',
                'is_active' => false,
            ]);
        }
    }
}
