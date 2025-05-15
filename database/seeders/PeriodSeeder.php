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
        }        $period1 = Period::create([
            'id' => 1,
            'name' => 'Q1 2025 Recruitment',
            'description' => 'First quarter recruitment campaign',
            'start_time' => '2025-01-01 00:00:00',
            'end_time' => '2025-03-31 23:59:59',
        ]);
        
        $period2 = Period::create([
            'id' => 2,
            'name' => 'Q2 2025 Recruitment',
            'description' => 'Second quarter recruitment campaign',
            'start_time' => '2025-04-01 00:00:00',
            'end_time' => '2025-06-30 23:59:59',
        ]);

        $period3 = Period::create([
            'id' => 3,
            'name' => 'Q3 2025 Recruitment',
            'description' => 'Third quarter recruitment campaign',
            'start_time' => '2025-07-01 00:00:00',
            'end_time' => '2025-09-30 23:59:59',
        ]);        $period4 = Period::create([
            'id' => 4,
            'name' => 'Q4 2025 Recruitment',
            'description' => 'Fourth quarter recruitment campaign',
            'start_time' => '2025-10-01 00:00:00',
            'end_time' => '2025-12-31 23:59:59',
        ]);

        // Associate periods with vacancies
        // First vacancy - associated with Q1 and Q3
        if ($vacancies->isNotEmpty()) {
            $firstVacancy = $vacancies->first();
            $firstVacancy->periods()->attach([$period1->id, $period3->id]);
            
            // Associate second vacancy with Q2 and Q4
            if ($vacancies->count() > 1) {
                $secondVacancy = $vacancies->skip(1)->first();
                $secondVacancy->periods()->attach([$period2->id, $period4->id]);
            }
            
            // Associate remaining vacancies with random periods
            foreach ($vacancies->slice(2) as $vacancy) {
                $periodsToAttach = [$period1->id, $period2->id, $period3->id, $period4->id];
                // Randomly select 1-2 periods for each vacancy
                $numPeriods = rand(1, 2);
                shuffle($periodsToAttach);
                $selectedPeriods = array_slice($periodsToAttach, 0, $numPeriods);
                $vacancy->periods()->attach($selectedPeriods);
            }
        }
    }
}
