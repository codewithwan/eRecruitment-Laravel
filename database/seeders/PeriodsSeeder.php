<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PeriodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('periods')->updateOrInsert(
            ['id' => 1],
            [
                'name' => 'Q1 2025 Recruitment',
                'description' => 'First quarter recruitment campaign',
                'start_time' => '2025-01-01 00:00:00',
                'end_time' => '2025-03-31 23:59:59',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('periods')->updateOrInsert(
            ['id' => 2],
            [
                'name' => 'Q2 2025 Recruitment',
                'description' => 'Second quarter recruitment campaign',
                'start_time' => '2025-04-01 00:00:00',
                'end_time' => '2025-06-30 23:59:59',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('periods')->updateOrInsert(
            ['id' => 3],
            [
                'name' => 'Q3 2025 Recruitment',
                'description' => 'Third quarter recruitment campaign',
                'start_time' => '2025-07-01 00:00:00',
                'end_time' => '2025-09-30 23:59:59',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('periods')->updateOrInsert(
            ['id' => 4],
            [
                'name' => 'Q4 2025 Recruitment',
                'description' => 'Fourth quarter recruitment campaign',
                'start_time' => '2025-10-01 00:00:00',
                'end_time' => '2025-12-31 23:59:59',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
