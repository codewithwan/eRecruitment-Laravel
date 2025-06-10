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
            MasterInstitutionSeeder::class,
            MasterGenderSeeder::class,
            CandidatesWorkExperiencesSeeder::class,
            SuperAdminSeeder::class,
            DepartmentsTableSeeder::class,
            StatusesSeeder::class,
            SelectionSeeder::class,
            CompaniesTableSeeder::class,
            JobTypesTableSeeder::class,
            CandidateEducationSeeder::class,
            CandidatesProfilesSeeder::class,
            SelectionSeeder::class,
            PeriodsSeeder::class,
            VacanciesPeriodsSeeder::class,
            VacanciesSeeder::class,
            ApplicationSeeder::class,
            AssessmentsSeeder::class,
            InterviewsSeeder::class,
            ApplicationHistorySeeder::class,



        ]);
    }
}
