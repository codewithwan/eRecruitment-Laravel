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
            MasterMajorSeeder::class,
            CandidatesProfilesSeeder::class,
            CandidatesWorkExperiencesSeeder::class,
            CandidatesOrganizationsSeeder::class,
            CandidatesAchievementsSeeder::class,
            CandidatesSocialMediaSeeder::class,
            SuperAdminSeeder::class,
            DepartmentsTableSeeder::class,
            SelectionSeeder::class,
            CompaniesTableSeeder::class,
            JobTypesTableSeeder::class,
            CandidatesEducationSeeder::class,
            SelectionSeeder::class,
            PeriodsSeeder::class,
            VacanciesSeeder::class,
            VacanciesPeriodsSeeder::class,
            ApplicationsSeeder::class,
            AssessmentsSeeder::class,
            InterviewsSeeder::class,
            ApplicationHistorySeeder::class,
            JobSeeder::class,
        ]);
    }
}
