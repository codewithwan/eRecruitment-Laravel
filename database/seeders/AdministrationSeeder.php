<?php

namespace Database\Seeders;

use App\Models\Administration;
use App\Models\Candidate;
use App\Models\Company;
use App\Models\Period;
use App\Models\Vacancy;
use Illuminate\Database\Seeder;

class AdministrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get candidates, companies, vacancies, and periods to create sample administrations
        $candidates = Candidate::all();
        $companies = Company::all();
        $vacancies = Vacancy::all();
        $periods = Period::all();
        
        // Create some sample administration records
        // This is simplified - adjust based on your actual data
        foreach ($candidates as $candidate) {
            Administration::create([
                'candidate_id' => $candidate->id,
                'company_id' => $companies->random()->id,
                'vacancy_id' => $vacancies->random()->id,
                'period_id' => $periods->random()->id,
            ]);
        }
    }
}
