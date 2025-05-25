<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterGenderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('master_genders')->insert([
            [
                'name' => 'male',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'female',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
