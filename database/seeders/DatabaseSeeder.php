<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SuperAdminSeeder::class,
            CompanySeeder::class,
            QuestionSeeder::class,
            QuestionPackSeeder::class,
            VacanciesSeeder::class,
            PeriodSeeder::class, // This will now create the periods and associate them with vacancies
            CandidateSeeder::class,
        ]);
    }
}
