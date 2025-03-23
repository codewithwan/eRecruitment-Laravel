<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create custom HR user
        User::factory()->create([
            'name' => 'HR User',
            'email' => 'hr@gmail.com',
            'password' => Hash::make('password'),
            'role' => UserRole::HR,
        ]);

        // Create custom Candidate user
        User::factory()->create([
            'name' => 'Candidate User',
            'email' => 'candidate@gmail.com',
            'password' => Hash::make('password'),
            'role' => UserRole::CANDIDATE,
        ]);

        // Create regular users
        User::factory(3)->create([
            'role' => UserRole::CANDIDATE,
        ]);

        // Create random users with created_at timestamps from the last 7 days
        $dayDistribution = [
            1 => 8,  // Yesterday: 8 users
            2 => 5,  // 2 days ago: 5 users
            3 => 6,  // 3 days ago: 6 users
            4 => 3,  // 4 days ago: 3 users
            5 => 7,  // 5 days ago: 7 users
            6 => 4,  // 6 days ago: 4 users
            7 => 6,  // 7 days ago: 6 users
        ];

        foreach ($dayDistribution as $daysAgo => $count) {
            $date = Carbon::now()->subDays($daysAgo);

            User::factory($count)->create([
                'role' => UserRole::CANDIDATE,
                'created_at' => $date->copy()->addHours(rand(0, 23))->addMinutes(rand(0, 59)),
                'updated_at' => $date->copy()->addHours(rand(0, 23))->addMinutes(rand(0, 59)),
            ]);
        }
    }
}
