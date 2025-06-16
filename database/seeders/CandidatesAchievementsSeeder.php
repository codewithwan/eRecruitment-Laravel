<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\CandidatesAchievements;
use App\Enums\UserRole;

class CandidatesAchievementsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $candidates = User::where('role', UserRole::CANDIDATE)->get();

        foreach ($candidates as $user) {
            CandidatesAchievements::create([
                'user_id' => $user->id,
                'title' => 'Juara 1 Lomba Coding',
                'level' => 'Nasional',
                'month' => 'Januari',
                'year' => rand(2019, 2023),
                'description' => 'Menjadi juara lomba coding tingkat nasional.',
                'certificate_file' => 'certificate.pdf',
                'supporting_file' => null,
            ]);
        }
    }
}
