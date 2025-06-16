<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\CandidatesSocialMedia;
use App\Enums\UserRole;

class CandidatesSocialMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $candidates = User::where('role', UserRole::CANDIDATE)->get();

        foreach ($candidates as $user) {
            CandidatesSocialMedia::create([
                'user_id' => $user->id,
                'platform_name' => 'LinkedIn',
                'url' => 'https://linkedin.com/in/candidate' . $user->id,
            ]);
        }
    }
}
