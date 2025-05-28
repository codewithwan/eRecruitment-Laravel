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
            PeriodSeeder::class,
            ApplicantSeeder::class, // Add applicant seeder at the end
        ]);
    }
}
