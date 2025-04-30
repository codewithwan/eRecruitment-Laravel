<?php

namespace Database\Seeders;

use App\Models\Period;
use Illuminate\Database\Seeder;

class PeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Period::create([
            'id' => 1,
            'name' => 'Q1 2025 Recruitment',
            'job_title' => 'BUSINESS EXECUTIVE',
            'start_date' => '2025-01-01',
            'end_date' => '2025-04-01',
            'description' => 'First quarter recruitment campaign',
        ]);

        Period::create([
            'id' => 2,
            'name' => 'Q2 2025 Recruitment',
            'job_title' => 'PRODUCT SPECIALIST',
            'start_date' => '2025-04-01', 
            'end_date' => '2025-07-01',
            'description' => 'Second quarter recruitment campaign',
        ]);
    }
}
