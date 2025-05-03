<?php

namespace Database\Seeders;

use App\Models\Period;
use App\Models\Vacancies;
use Illuminate\Database\Seeder;

class PeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some vacancies to associate with the periods
        $vacancies = Vacancies::all();
        
        if ($vacancies->isEmpty()) {
            $this->command->info('No vacancies found. Skipping period seeding.');
            return;
        }
        
        Period::create([
            'id' => 1,
            'name' => 'Q1 2025 Recruitment',
            'description' => 'First quarter recruitment campaign',
            'vacancies_id' => $vacancies->first()->id,
        ]);

        Period::create([
            'id' => 2,
            'name' => 'Q2 2025 Recruitment',
            'description' => 'Second quarter recruitment campaign',
            'vacancies_id' => $vacancies->last()->id,
        ]);
    }
}
