<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    protected $faker;

    public function __construct()
    {
        $this->faker = Faker::create();
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus user HR jika sudah ada
        User::where('email', 'hr@gmail.com')->delete();

        // User HR (manual)
        User::factory()->create([
            'name' => 'HR User',
            'email' => 'hr@gmail.com',
            'password' => Hash::make('password'),
            'role' => UserRole::HR,
            'no_ektp' => $this->faker->unique()->numerify('################'),
        ]);

        // Hapus relasi candidate profile user id 1 jika ada
        \DB::table('candidates_profiles')->where('user_id', 1)->delete();

        // Hapus candidate id 1 jika ada
        User::where('id', 1)->delete();

        // User Candidate (manual)
        User::create([
            'id' => 1,
            'name' => 'Candidate User',
            'email' => 'candidate@gmail.com',
            'password' => Hash::make('password'),
            'role' => UserRole::CANDIDATE,
            'no_ektp' => $this->faker->unique()->numerify('################'),
        ]);

        // Hapus user id 2 jika ada
        User::where('id', 2)->delete();

        // Tambahkan user id = 2
        User::create([
            'id' => 2,
            'name' => 'Candidate User 2',
            'email' => 'candidate2@gmail.com',
            'password' => Hash::make('password'),
            'role' => UserRole::CANDIDATE,
            'no_ektp' => $this->faker->unique()->numerify('################'),
        ]);

        // Batch factory, JANGAN isi no_ektp manual!
        User::factory(3)->create([
            'role' => UserRole::CANDIDATE,
        ]);

        // Batch harian, JANGAN isi no_ektp manual!
        $dayDistribution = [
            1 => 8,
            2 => 5,
            3 => 6,
            4 => 3,
            5 => 7,
            6 => 4,
            7 => 6,
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
