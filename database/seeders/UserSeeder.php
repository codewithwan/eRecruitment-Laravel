<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
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
    }
}
