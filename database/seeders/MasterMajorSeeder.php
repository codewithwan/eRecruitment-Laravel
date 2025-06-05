<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterMajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('master_majors')->insert([
            [
                'name' => 'Teknik Informatika',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Manajemen',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Akuntansi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Teknik Elektro',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Psikologi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
