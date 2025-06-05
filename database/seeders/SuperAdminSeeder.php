<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus user superadmin jika sudah ada
        User::where('email', env('SUPER_ADMIN_EMAIL', 'superadmin@gmail.com'))->delete();

        User::factory()->create([
            'name' => env('SUPER_ADMIN_NAME', 'Super Admin'),
            'email' => env('SUPER_ADMIN_EMAIL', 'superadmin@gmail.com'),
            'password' => Hash::make(env('SUPER_ADMIN_PASSWORD', 'password')),
            'role' => UserRole::HR,
        ]);
        $this->command->info('Super Admin created successfully');
    }
}
